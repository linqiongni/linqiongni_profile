from PIL import Image, ImageFilter
import sys
from collections import deque


def color_distance(a, b):
    return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5


def remove_white_bg(input_path, output_path,
                    tolerance=42,
                    erode=3, dilate=3,
                    edge_erode=2, feather=2.2,
                    edge_saturation_threshold=18,
                    edge_value_threshold=230,
                    width=640, quality=85):
    """
    把纯色白底证件照转为透明 PNG/WebP。
    算法：
    1) 四角 BFS flood fill 标记背景；
    2) 形态学开运算：腐蚀断细桥 -> 保留最大连通域（去掉两臂间封闭白洞）-> 膨胀回原尺寸；
    3) 边缘再腐蚀切掉浅色光晕；
    4) 高斯羽化让边缘自然；
    5) 对仍残留在边缘的低饱和高亮像素进一步压低 alpha。
    """
    img = Image.open(input_path).convert('RGBA')
    orig_w, orig_h = img.size

    # 轻微降噪，避免 JPEG 噪点导致 flood fill 穿孔
    denoised = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    pixels = denoised.load()

    w, h = orig_w, orig_h
    mask = [[0] * h for _ in range(w)]
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    visited = set(seeds)
    queue = deque()
    for x, y in seeds:
        mask[x][y] = 1
        queue.append((x, y))

    bg_color = (255, 255, 255, 255)
    while queue:
        x, y = queue.popleft()
        r, g, b, a = pixels[x, y]
        if color_distance((r, g, b, a), bg_color) > tolerance:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                visited.add((nx, ny))
                nr, ng, nb, na = pixels[nx, ny]
                if color_distance((nr, ng, nb, na), bg_color) <= tolerance:
                    mask[nx][ny] = 1
                    queue.append((nx, ny))

    # 生成前景 mask（背景=0，前景=255）
    mask_img = Image.new('L', (w, h), 0)
    mp = mask_img.load()
    for x in range(w):
        for y in range(h):
            mp[x, y] = 0 if mask[x][y] else 255

    # 形态学开运算：腐蚀 -> 保留最大连通域 -> 膨胀
    if erode > 0:
        for _ in range(erode):
            mask_img = mask_img.filter(ImageFilter.MinFilter(3))

    # 保留最大连通域（去掉小洞/碎片）
    mp = mask_img.load()
    visited = [[False] * h for _ in range(w)]
    best_size = 0
    best_points = []
    for sx in range(w):
        for sy in range(h):
            if mp[sx, sy] == 255 and not visited[sx][sy]:
                comp = []
                q = deque([(sx, sy)])
                visited[sx][sy] = True
                while q:
                    cx, cy = q.popleft()
                    comp.append((cx, cy))
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and mp[nx, ny] == 255:
                            visited[nx][ny] = True
                            q.append((nx, ny))
                if len(comp) > best_size:
                    best_size = len(comp)
                    best_points = comp
    mask_img = Image.new('L', (w, h), 0)
    mp = mask_img.load()
    for x, y in best_points:
        mp[x, y] = 255

    if dilate > 0:
        for _ in range(dilate):
            mask_img = mask_img.filter(ImageFilter.MaxFilter(3))

    # 边缘再腐蚀，切掉残留的浅色光晕
    if edge_erode > 0:
        for _ in range(edge_erode):
            mask_img = mask_img.filter(ImageFilter.MinFilter(3))

    # 羽化边缘
    if feather > 0:
        mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=feather))

    # 应用 mask 到原图
    final = img.copy()
    final.putalpha(mask_img)

    # 对边缘残余浅色像素进一步压低 alpha
    fp = final.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = fp[x, y]
            if a == 0 or a == 255:
                continue
            # 转简单 HSV 判断低饱和高亮
            mx = max(r, g, b)
            mn = min(r, g, b)
            delta = mx - mn
            saturation = 0 if mx == 0 else (delta / mx) * 255
            value = mx
            if value > edge_value_threshold and saturation < edge_saturation_threshold:
                # 越接近纯白 alpha 压越低
                alpha_factor = max(0.0, (value - edge_value_threshold) / (255 - edge_value_threshold))
                fp[x, y] = (r, g, b, int(a * (1 - alpha_factor)))

    # 保留完整画布（含去背后的透明留白），不紧裁到人物，避免 object-cover 把头部切掉
    # 等比缩放至目标宽度
    if width and final.width > width:
        ratio = width / final.width
        new_h = int(final.height * ratio)
        final = final.resize((width, new_h), Image.LANCZOS)

    # 加透明留白，使最终宽高比接近 4:5（0.8），保证在 aspect-[4/5]+object-cover 下完整显示头部
    target_ratio = 0.8  # w/h
    cur_w, cur_h = final.size
    cur_ratio = cur_w / cur_h
    if cur_ratio < target_ratio:
        new_w = int(round(cur_h * target_ratio))
        new_h = cur_h
    else:
        new_w = cur_w
        new_h = int(round(cur_w / target_ratio))
    pad_x = (new_w - cur_w) // 2
    pad_y = (new_h - cur_h) // 2
    canvas = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
    canvas.paste(final, (pad_x, pad_y), final)
    final = canvas

    # 输出
    if output_path.lower().endswith('.webp'):
        # WebP 不支持 RGBA 时需转 RGB 带透明；Pillow webp 支持 alpha
        final.save(output_path, 'WEBP', quality=quality, method=6)
    else:
        final.save(output_path, 'PNG')
    print(f'Saved: {output_path} ({final.width}x{final.height})')


if __name__ == '__main__':
    if len(sys.argv) >= 3:
        input_path = sys.argv[1]
        output_path = sys.argv[2]
    else:
        input_path = '/Users/linqiongni/.workbuddy/clipboard-images/clipboard-2026-09-23T01-27-25-568Z-fca423eb.jpg'
        output_path = '/Users/linqiongni/Downloads/linqiongni_profile/src/assets/images/lin_qiongni_portrait_new.webp'
    remove_white_bg(input_path, output_path)
