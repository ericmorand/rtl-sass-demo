var Language = function (name, code, direction, lorem) {
  return {
    name: name,
    code: code,
    direction: direction,
    lorem: lorem,
  }
};

var languages = [
  new Language('Left-to-right', 'en', 'ltr', 'Lorem ipsum dolor sit amet, ferri conclusionemque eum et. Ei accusata invenire convenire nam. Ad sit lorem ubique ceteros, probo illum consulatu no duo, nam laudem quaeque ne. Ne ius amet deleniti quaestio.'),
  new Language('Right-to-left', 'ar', 'rtl', 'من المسرح والنرويج دون, احداث وتتحمّل والفرنسي كل بلا, حتى ٣٠ بقعة ا الفرنسية. مما ديسمبر العمليات الشّعبين ٣٠, لان في التنازلي استطاعوا. حادثة المتحدة عن وفي. أمام وحرمان دون تم. الغالي الثقيلة ذات ثم, فكانت الدولارات حين أي.')
];

module.exports = {
  languages: languages
};
