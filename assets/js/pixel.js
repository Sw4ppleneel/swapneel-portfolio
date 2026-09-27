// Shared pixel-art kit: one palette, a string-sprite renderer, the icon set and the walker.
// Sprites are rows of characters; each character maps to a palette colour ('.' = transparent).
(function(){
  const PAL = {
    k:'#0A0D26', K:'#000000', w:'#ECE4D2', W:'#FFFFFF', u:'#BFB39A',
    g:'#8D93B5', G:'#4A5080', m:'#D9DCE6', M:'#9EA3BD',
    o:'#FF6A1A', O:'#C94B0C', y:'#FFD24A', Y:'#C99A1C', r:'#C8102E', R:'#7E0E20',
    b:'#9CC3E6', B:'#3E6FD8', c:'#6FD3FF', C:'#1E6F99',
    n:'#8B5A2B', N:'#5A3A1C', e:'#62D38B', E:'#2F7A4A',
    p:'#C98BA6', P:'#8E5A73', s:'#C68A62', S:'#9A6446', h:'#1A1410',
    v:'#2A2F45', V:'#1C2033', t:'#121218', x:'#FF5A4E', H:'#4A4262'
  };

  function draw(ctx, rows, x, y, opt){
    opt = opt || {};
    const s = opt.scale || 1, flip = !!opt.flip, pal = opt.pal || PAL;
    const w = rows[0].length;
    for(let j=0;j<rows.length;j++){
      const row = rows[j];
      for(let i=0;i<row.length;i++){
        const ch = row[i];
        if(ch === '.' || ch === ' ') continue;
        const col = pal[ch]; if(!col) continue;
        ctx.fillStyle = col;
        const xi = flip ? (w-1-i) : i;
        ctx.fillRect(x + xi*s, y + j*s, s, s);
      }
    }
  }

  // ─── the walker (12 × 22), facing right, guitar case on his back ───
  const HEAD = [
    '...hhhHH....',
    '..hhhhhhHH..',
    '.hhhhhhhhhH.',
    '.hhhhhhhhhH.',
    'hhhhhhhsshh.',
    'hhhhhhsmmms.',
    '.hhhhhssssS.',
    '.hhhh.sssss.',
    '..hh...ss...'
  ];
  const HEAD_UP = [
    '...hhhHH....',
    '..hhhhhhHH..',
    '.hhhhhhhhhH.',
    '.hhhhhhhsmm.',
    'hhhhhhhssss.',
    'hhhhhhsssss.',
    '.hhhhhsssS..',
    '.hhhh..sss..',
    '..hh...ss...'
  ];
  const TORSO_A = [
    '.Nnnwwttwu..',
    '.Nnnwwttwus.',
    '.Nnnwwttwus.',
    '.Nnnwwttwu..',
    '.Nnnwwttwu..'
  ];
  const TORSO_B = [
    '.Nnnwwttwu..',
    '.Nnnwwttuw..',
    '.Nnnwwttuw..',
    '.Nnnwwtsuw..',
    '.Nnnwwttwu..'
  ];
  const LEGS = [
    ['.Nn.vvvvv...','.Nn.vvvvvv..','....vvVvvv..','...vvV..vv..','...vv....vv.','..vv.....vv.','..vv......vv','.WWW......WW'],
    ['.Nn.vvvvv...','.Nn.vvvvv...','....vvvvv...','....vvVv....','....vvVv....','....vvvv....','....vvvv....','....WWWWW...'],
    ['.Nn.vvvvv...','.Nn.vvvvvv..','....vvvVvv..','...vv..Vvv..','...vv...vv..','..vv.....vv.','.vv......vv.','.WW.....WWW.'],
    ['.Nn.vvvvv...','.Nn.vvvvv...','....vvvvv...','....vVvv....','....vVvv....','....vvvv....','....vvvv....','....WWWWW...']
  ];
  const STAND = ['.Nn.vvvvv...','.Nn.vvvvv...','....vvvvv...','....vv.vv...','....vv.vv...','....vv.vv...','....vv.vv...','...WWW.WWW..'];

  function walker(frame, pose){
    // frame 0..3 for walking; pose 'stand' | 'look'
    if(pose === 'look') return HEAD_UP.concat(TORSO_A, STAND);
    if(pose === 'stand') return HEAD.concat(TORSO_A, STAND);
    const torso = (frame % 2 === 0) ? TORSO_A : TORSO_B;
    return HEAD.concat(torso, LEGS[frame % 4]);
  }

  // ─── icons (16 × 16) ───
  const ICONS = {
    bell:[
      '................','.......oo.......','......oyyo......','.....oyyyyo.....','....oyyyyyyo....','....oyyWyyyo....',
      '....oyyWyyyo....','...oyyyyyyyyo...','...oyyyyyyyyo...','..oyyyyyyyyyyo..','..oYYYYYYYYYYo..','...oooooooooo...',
      '.......oo.......','......oOOo......','.......oo.......','................'],
    lens:[
      '................','.gggggggggg.....','.g..g..g..g.....','.gggggggggg.....','.g..g.bbbb......','.ggggbWW..b.....',
      '.g..bW....bb....','.gggb......b....','....b......b....','....bb....bb....','.....b....bw....','......bbbb.ww...',
      '............ww..','.............ww.','..............w.','................'],
    brain:[
      '................','....pppppp......','...pPppPpppp....','..ppppPpppPpp...','..pPppppPppppp..','.pppPppppppPpp..',
      '.ppppppPppppPp..','.pPpppPpppPppp..','..pppppppPpppp..','..ppPppPppppp...','...pppppPppp....','.....pppp.pp....',
      '.........pp.....','.........pp.....','................','................'],
    pill:[
      '................','................','..........www...','.........wWwww..','........wWwwwww.','.......rwwwwwww.',
      '......rrrwwwwww.','.....rrrrrwwww..','....rWrrrrrww...','...rWrrrrrr.....','..rrrrrrrrr.....','..rrrrrrrr......',
      '..rrrrrrr.......','...rrrrr........','................','................'],
    phone:[
      '................','.....mmmmmm.....','....mggggggm....','....mbbbbbbm....','....mbWbbbbm....','....mbbbbbbm....',
      '....mbbbWbbm....','....mbbbbbbm....','....mbbbbbbm....','....mbbbbbbm....','....mggggggm....','....mgggwggm....',
      '.....mmmmmm.....','................','................','................'],
    cloud:[
      '................','................','................','......mmmm......','.....mWWWWm.....','..mmmWWWWWWm....',
      '.mWWWWWWWWWWmm..','mWWWWWWWWWWWWWm.','mWWWWWWWWWWWWWm.','mMMMMMMMMMMMMMm.','.mmmmmmmmmmmmm..','................',
      '................','................','................','................'],
    server:[
      '................','..mmmmmmmmmmmm..','..mGGGGGGGGGGm..','..mGeGGggggGGm..','..mGGGGGGGGGGm..','..mmmmmmmmmmmm..',
      '..mGGGGGGGGGGm..','..mGeGGggggGGm..','..mGGGGGGGGGGm..','..mmmmmmmmmmmm..','..mGGGGGGGGGGm..','..mGeGGggggGGm..',
      '..mGGGGGGGGGGm..','..mmmmmmmmmmmm..','.....m....m.....','................'],
    db:[
      '................','....bbbbbbbb....','..bbWWWWWWWWbb..','..bBbbbbbbbbBb..','..bBBBBBBBBBBb..','..bbbbbbbbbbbb..',
      '..bBBBBBBBBBBb..','..bBBBBBBBBBBb..','..bbbbbbbbbbbb..','..bBBBBBBBBBBb..','..bBBBBBBBBBBb..','..bbBBBBBBBBbb..',
      '....bbbbbbbb....','................','................','................'],
    queue:[
      '................','................','.yyyy.yyyy.yyyy.','.yWWy.yWWy.yWWy.','.yyyy.yyyy.yyyy.','................',
      '.yyyy.yyyy......','.yWWy.yWWy......','.yyyy.yyyy......','................','.yyyy...........','.yWWy...........',
      '.yyyy...........','................','................','................'],
    bucket:[
      '................','................','..oooooooooooo..','..oWWWWWWWWWWo..','..oooooooooooo..','...oOOOOOOOOo...',
      '...oOOOOOOOOo...','...oOOwwwwOOo...','...oOOOOOOOOo...','....oOOOOOOo....','....oOOOOOOo....','....oOOOOOOo....',
      '.....oooooo.....','................','................','................'],
    book:[
      '................','..NNNNNNNNNNN...','..NnnnnnnnnnnN..','..NnyyyyyyynnN..','..NnnnnnnnnnnN..','..NnnyyyyynnnN..',
      '..NnnnnnnnnnnN..','..NnnnnnnnnnnN..','..NnnnnnnnnnnN..','..NnnnnnnnnnnN..','..NnnnnnnnnnnN..','..NwwwwwwwwwwN..',
      '..NuuuuuuuuuuN..','..NNNNNNNNNNN...','................','................'],
    quill:[
      '................','............WW..','..........WWwW..','.........WwwwW..','........WwwwW...','.......WwwwW....',
      '......WwwwW.....','.....WwwwW......','.....wwwW.......','....www.........','....ww..........','...ow...........',
      '..oo............','.ooo............','.kk.............','................'],
    guitar:[
      '............mm..','...........mGm..','..........mGm...','.........mGm....','........mGm.....','.......wGw......',
      '..www.wGw.......','.wWWWwGw........','wWWrWWWw........','wWWWWWWw........','.wWWrWWWw.......','..wWWWWWWw......',
      '..wWWWWWWw......','...wWWWWw.......','....wwww........','................'],
    ds:[
      '................','..GGGGGGGGGGGG..','..GccccccccccG..','..GcCCccccCCcG..','..GccccccccccG..','..GccccccccccG..',
      '..GGGGGGGGGGGG..','..gggggggggggg..','..GGGGGGGGGGGG..','..GwwwwwwwwwwG..','..GwkkwwwwwwwG..','..GwwwwwwwkkwG..',
      '..GwwwwwwwwwwG..','..GGGGGGGGGGGG..','................','................'],
    tv:[
      '................','.....m....m.....','......m..m......','.......mm.......','.mmmmmmmmmmmmmm.','.mBBBBBBBBBBBGm.',
      '.mBcBBBBBBBBBGm.','.mBBBBBBBBBBBGm.','.mBBBBBWBBBBBGm.','.mBBBBBBBBBBBGm.','.mBBBBBBBBBBBGm.','.mmmmmmmmmmmmmm.',
      '...GG......GG...','................','................','................'],
    chart:[
      '................','................','.m..............','.m.........oo...','.m........o..o..','.m.......o......',
      '.m..bb..o.......','.m..bb.o........','.m..bbo....bb...','.m..bb.....bb...','.m..bb.bb..bb...','.m..bb.bb..bb...',
      '.m..bb.bb..bb...','.mmmmmmmmmmmmmm.','................','................'],
    cite:[
      '................','...wwwwwwwww....','...wWWWWWWWww...','...wWggggWWwWw..','...wWWWWWWWwwww.','...wWggggggWWWw.',
      '...wWWWWWWWWWWw.','...wWggggggWWWw.','...wWWWWWWWWWWw.','...wWgggWWWWeWw.','...wWWWWWWWeWWw.','...wWgggWeWeWWw.',
      '...wWWWWWWeWWWw.','...wwwwwwwwwwww.','................','................'],
    plane:[
      '................','................','.............W..','...........WWb..','.........WWwb...','.......WWwwb....',
      '.....WWwwwb.....','...WWwwwwb......','.WWwwwwwb.......','...bbwwb........','.....bwb........','.....bb.........',
      '....b...........','...b............','..o.o.o.........','................'],
    peak:[
      '................','................','.........y......','................','......W.........','.....WWW........',
      '....WWmWW.......','...WmMMmMW..G...','..GMMMMMMMG.GG..','.GGMMMMMMMGGGGG.','GGGGGMMGGGGGGGGG','GGGGGGGGGGGGGGGG',
      '................','................','................','................']
  };

  function icon(canvas, name){
    const rows = ICONS[name]; if(!rows) return;
    const ctx = canvas.getContext('2d');
    const s = Math.max(1, Math.floor(canvas.width / 16));
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw(ctx, rows, Math.floor((canvas.width - 16*s)/2), Math.floor((canvas.height - 16*s)/2), {scale:s});
  }

  function paintIcons(root){
    (root || document).querySelectorAll('canvas[data-icon]').forEach(c => icon(c, c.dataset.icon));
  }

  // Ordered 4×4 Bayer matrix, shared by anything that dithers.
  const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + .5) / 16);

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.PX = { PAL, draw, walker, ICONS, icon, paintIcons, BAYER, reduced };
})();
