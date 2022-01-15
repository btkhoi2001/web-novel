
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
      var matches;
      matches = [];
      substrRegex = new RegExp(q, 'i');
      $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
              matches.push(str);
          }
      });
      cb(matches);
  };
};

$('#genres').tagsinput({
  typeaheadjs:({
      hint: true,
      highlight: true,
      minLength: 1
  }, {
      name: 'genres',
      source: substringMatcher(genresName)
  })
});