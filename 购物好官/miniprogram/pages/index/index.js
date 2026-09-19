// 购物好官 · 首页逻辑
const { calcSize } = require('../../utils/size.js');

const SHAPE = ['梨形', '苹果', '沙漏', '矩形', '倒三角'];
const STYLE = ['通勤', '休闲', '复古', '极简', '甜美', '辣妹', '国风', '运动', '学院', '中性'];
const CAT = ['上衣', '裤子', '裙子', '外套', '连衣裙', '内衣', '鞋', '配饰'];
const OCC = ['上班', '约会', '旅行', '日常', '面试', '聚会'];
const HELP = ['拿尺码', '找试衣间', '搭配建议', '叫我去试', '帮我留货', '全程陪同推荐'];

Page({
  data: {
    sex: '女',
    height: '', weight: '', bust: '', waist: '', hip: '', age: '',
    shapeList: SHAPE, shapeSel: [],
    fit: '标准',
    styleList: STYLE, styleSel: [],
    likeColor: '', dislike: '',
    mode: 'self',
    catList: CAT, catSel: [],
    occList: OCC, occSel: [],
    budget: '', qty: '',
    helpList: HELP, helpSel: [],
    note: '您好，我不太爱开口，但很需要您的专业眼光——请按这张卡帮我，谢谢！',
    showCard: false,
    card: {}
  },

  onLoad() {
    this.loadProfile();
  },

  // ---------- 输入 ----------
  onInput(e) {
    const k = e.currentTarget.dataset.k;
    this.setData({ [k]: e.detail.value });
    if (['height', 'weight', 'bust', 'waist', 'hip', 'age', 'likeColor', 'dislike'].indexOf(k) > -1) {
      this.saveProfile();
    }
  },

  setSex(e) { this.setData({ sex: e.currentTarget.dataset.v }); this.saveProfile(); },
  setFit(e) { this.setData({ fit: e.currentTarget.dataset.v }); this.saveProfile(); },
  setMode(e) { this.setData({ mode: e.currentTarget.dataset.v }); },

  toggle(e) {
    const g = e.currentTarget.dataset.group;
    const v = e.currentTarget.dataset.v;
    const arr = this.data[g].slice();
    const i = arr.indexOf(v);
    if (i > -1) arr.splice(i, 1); else arr.push(v);
    this.setData({ [g]: arr });
    if (g === 'shapeSel' || g === 'styleSel') this.saveProfile();
  },

  noop() {},

  // ---------- 存档（本地）----------
  saveProfile() {
    const d = this.data;
    wx.setStorageSync('gougou_profile', {
      sex: d.sex, height: d.height, weight: d.weight, bust: d.bust,
      waist: d.waist, hip: d.hip, age: d.age,
      shapeSel: d.shapeSel, fit: d.fit, styleSel: d.styleSel,
      likeColor: d.likeColor, dislike: d.dislike
    });
  },
  loadProfile() {
    const p = wx.getStorageSync('gougou_profile');
    if (p && p.sex) {
      this.setData({
        sex: p.sex || '女', height: p.height || '', weight: p.weight || '',
        bust: p.bust || '', waist: p.waist || '', hip: p.hip || '',
        age: p.age || '', shapeSel: p.shapeSel || [], fit: p.fit || '标准',
        styleSel: p.styleSel || [], likeColor: p.likeColor || '', dislike: p.dislike || ''
      });
    }
  },

  // ---------- 生成卡片 ----------
  openCard() {
    const d = this.data;
    const size = calcSize(d.sex, +d.height, +d.weight, d.fit);
    const modeText = d.mode === 'self'
      ? '🟢 自助模式：我自己看，需要时在卡上勾的选项找您'
      : '🔵 导购模式：请按以下需求帮我推荐 / 搭配';
    const led = d.mode === 'self' ? '#7BCFB6' : '#9AD0F5';

    const body = [];
    if (d.height) body.push('身高 ' + d.height + 'cm');
    if (d.weight) body.push('体重 ' + d.weight + 'kg');
    if (d.bust) body.push('胸 ' + d.bust);
    if (d.waist) body.push('腰 ' + d.waist);
    if (d.hip) body.push('臀 ' + d.hip);
    if (d.age) body.push('年龄 ' + d.age);
    let bodyText = body.join(' · ');
    if (d.shapeSel.length) bodyText += ' (' + d.shapeSel.join('/') + ')';
    if (d.fit && d.fit !== '标准') bodyText += ' · ' + d.fit;

    const needList = [];
    if (d.catSel.length) needList.push('找：' + d.catSel.join('/'));
    if (d.occSel.length) needList.push('场景：' + d.occSel.join('/'));
    if (d.budget) needList.push('预算：' + d.budget);
    if (d.qty) needList.push('数量：' + d.qty);

    const card = {
      led: led, modeText: modeText, bodyText: bodyText, size: size,
      styleTags: d.styleSel, needList: needList, helpTags: d.helpSel,
      likeColor: d.likeColor, dislike: d.dislike
    };
    this.setData({ showCard: true, card: card });
    wx.setStorageSync('gougou_card', card);
  },
  closeCard() { this.setData({ showCard: false }); },

  // ---------- 保存图片 ----------
  saveImage() {
    const d = this.data;
    const card = d.card;
    const q = wx.createSelectorQuery();
    q.select('#cardCanvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) { wx.showToast({ title: '保存失败', icon: 'none' }); return; }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = (wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()).pixelRatio || 2;
      const W = 320, H = 540;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);

      // 背景
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
      // 顶部
      ctx.fillStyle = '#FF9AA2'; ctx.fillRect(0, 0, W, 64);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif'; ctx.fillText('🛍️ 购物好官卡', 16, 28);
      ctx.font = '11px sans-serif'; ctx.fillText('请按这张卡帮我', 16, 48);
      // 模式
      ctx.fillStyle = card.led; ctx.beginPath(); ctx.arc(20, 84, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#4A4A4A'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(card.modeText, 32, 88);
      // 身材
      ctx.fillStyle = '#8A8A8A'; ctx.font = '10px sans-serif'; ctx.fillText('身 材', 16, 116);
      ctx.fillStyle = '#4A4A4A'; ctx.font = '13px sans-serif'; ctx.fillText(card.bodyText, 16, 136);
      if (card.size) { ctx.fillStyle = '#2c5a52'; ctx.fillText('建议 ' + card.size, 16, 156); }
      // 风格
      let y = 184;
      ctx.fillStyle = '#8A8A8A'; ctx.font = '10px sans-serif'; ctx.fillText('风 格', 16, y);
      ctx.fillStyle = '#4A4A4A'; ctx.font = '13px sans-serif';
      ctx.fillText((card.styleTags || []).join(' / ') || '未填', 16, y + 20);
      if (card.likeColor) { ctx.fillText('💛 喜欢：' + card.likeColor, 16, y + 40); }
      if (card.dislike) { ctx.fillText('🚫 雷区：' + card.dislike, 16, y + 60); }
      // 需求
      y = y + 88;
      ctx.fillStyle = '#8A8A8A'; ctx.font = '10px sans-serif'; ctx.fillText('本 次 需 求', 16, y);
      ctx.fillStyle = '#4A4A4A'; ctx.font = '13px sans-serif';
      (card.needList || []).forEach((t, i) => ctx.fillText(t, 16, y + 20 + i * 20));
      // 帮助
      y = y + 20 + Math.max(1, (card.needList || []).length) * 20 + 12;
      ctx.fillStyle = '#8A8A8A'; ctx.font = '10px sans-serif'; ctx.fillText('希 望 您 帮 我', 16, y);
      ctx.fillStyle = '#4A4A4A'; ctx.font = '13px sans-serif';
      ctx.fillText((card.helpTags || []).join(' / ') || '未填', 16, y + 20);
      // 留言
      y = y + 44;
      ctx.fillStyle = '#8A8A8A'; ctx.font = '10px sans-serif'; ctx.fillText('留 言 给 您', 16, y);
      ctx.fillStyle = '#7a6a4a'; ctx.font = '12px sans-serif';
      ctx.fillText(d.note, 16, y + 20);
      // 页脚
      ctx.fillStyle = '#B0A89C'; ctx.font = '10px sans-serif';
      ctx.fillText('—— 由「购物好官」生成 · 尺码仅供参考', 16, H - 14);

      wx.canvasToTempFilePath({
        canvas: canvas,
        success: r => {
          wx.saveImageToPhotosAlbum({
            filePath: r.tempFilePath,
            success: () => wx.showToast({ title: '已保存到相册' }),
            fail: () => wx.showToast({ title: '请先授权相册', icon: 'none' })
          });
        },
        fail: () => wx.showToast({ title: '生成失败', icon: 'none' })
      });
    });
  },

  // ---------- 分享 ----------
  onShareAppMessage() {
    return { title: '购物好官 · 安静选衣也能被好好服务', path: '/pages/index/index' };
  },
  onShareTimeline() {
    return { title: '购物好官 · 安静选衣也能被好好服务' };
  }
});
