function findProgress(d) {
  return global.milestones.find(e => e.Type === '6' && e.Index === d.toString());
}
function GetListAwards() {
  var i = {
    'Indexes': [],
    'Amount': []
  };
  var p = {
    'Indexes': [],
    'Amount': []
  };
  var q = {
    'Indexes': [],
    'Amount': []
  };
  var r = {
    'Indexes': [],
    'Amount': []
  };
  var s = {
    'Indexes': [],
    'Amount': []
  };
  var t = {
    'Indexes': [],
    'Amount': []
  };
  var u = {
    'Indexes': [],
    'Amount': []
  };
  var v = {
    'Indexes': [],
    'Amount': []
  };
  var w = {
    'Indexes': [],
    'Amount': []
  };
  const x = global.milestones.filter(y => y.Type === '6').length;
  for (let y = 0x0; y < x; y++) {
    const A = y.toString();
    const B = global.milestones.find(C => C.Type === '6' && C.Index === A);
    if (B !== undefined) {
      if (B.PrimaryLvlUpRewardType === '1') {
        i.Indexes.push(parseInt(B.Index));
        i.Amount.push(parseInt(B.PrimaryLvlUpRewardCount));
      }
      if (B.PrimaryLvlUpRewardType === '3') {
        w.Indexes.push(parseInt(B.Index));
        w.Amount.push(parseInt(global.Characters.getIDByCodename(B.PrimaryLvlUpRewardHero)));
      }
      if (B.PrimaryLvlUpRewardType === '6') {
        p.Indexes.push(parseInt(B.Index));
        p.Amount.push(0x1);
      }
      if (B.PrimaryLvlUpRewardType === '7') {
        u.Indexes.push(parseInt(B.Index));
        u.Amount.push(parseInt(B.PrimaryLvlUpRewardCount));
      }
      if (B.PrimaryLvlUpRewardType === '9') {
        s.Indexes.push(parseInt(B.Index));
        s.Amount.push(parseInt(B.PrimaryLvlUpRewardCount));
      }
      if (B.PrimaryLvlUpRewardType === '10') {
        r.Indexes.push(parseInt(B.Index));
        r.Amount.push(parseInt(0x1));
      }
      if (B.PrimaryLvlUpRewardType === '12') {
        t.Indexes.push(parseInt(B.Index));
        t.Amount.push(parseInt(B.PrimaryLvlUpRewardCount));
      }
      if (B.PrimaryLvlUpRewardType === '13') {
        v.Indexes.push(parseInt(B.Index));
        v.Amount.push(parseInt(B.PrimaryLvlUpRewardCount));
      }
      if (B.PrimaryLvlUpRewardType === '14') {
        q.Indexes.push(parseInt(B.Index));
        q.Amount.push(parseInt(0x1));
      }
    }
  }
  return {
    'Gold': i,
    'Box': p,
    'BigBox': q,
    'MegaBox': r,
    'TokenDoubler': s,
    'PowerPoints': t,
    'Tickets': u,
    'toDoNothing': v,
    'Brawlers': w
  };
}
module.exports = {
  'findProgress': findProgress,
  'GetListAwards': GetListAwards
};