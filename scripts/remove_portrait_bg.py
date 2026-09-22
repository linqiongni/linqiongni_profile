from PIL import Image, ImageFilter
import sys





def remove_white_bg(input_path, output_path, tolerance=35, feather=2):
    img = Image.open(input_path).convert('RGBA')
    w, h = img.size

    # 轻微降噪，避免 JPEG 噪点导致 flood fill 穿孔
    denoised = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    pixels = denoised.load()

    # 创建背景 mask：从四角 flood fill
    mask = [[0] * h for _ in range(w)]
    stack = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    visited = set(stack)
    for x, y in stack:
        mask[x][y] = 1

    def color_distance(a, b):
        return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5

    bg_color = (255, 255, 255, 255)
    while stack:
        x, y = stack.pop()
        r, g, b, a = pixels[x, y]
        if color_distance((r, g, b, a), bg_color) > tolerance:
            continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                visited.add((nx, ny))
                stack.append((nx, ny))
                mask[nx][ny] = 1

    # 生成灰度 mask 图像：背景=0，前景=255
    mask_img = Image.new('L', (w, h), 0)
    mask_pixels = mask_img.load()
    for x in range(w):
        for y in range(h):
            mask_pixels[x, y] = 0 if mask[x][y] else 255

    # 轻微闭运算，修整发丝级边缘
    mask_img = mask_img.filter(ImageFilter.MaxFilter(3))
    mask_img = mask_img.filter(ImageFilter.MinFilter(3))

    # 羽化边缘，避免硬白边
    if feather > 0:
        mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=feather))

    # 应用 mask
    img.putalpha(mask_img)

    img.save(output_path, 'PNG')
    print(f'Saved: {output_path}')


if __name__ == '__main__':
    input_path = '/Users/linqiongni/Downloads/linqiongni_profile/src/assets/images/lin_qiongni_portrait_new.jpg'
    output_path = '/Users/linqiongni/Downloads/linqiongni_profile/src/assets/images/lin_qiongni_portrait_new.png'
    remove_white_bg(input_path, output_path)
