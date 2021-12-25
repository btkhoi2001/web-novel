var genres = ['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đam Mỹ', 'Quan Trường', 'Võng Du', 'Khoa Huyễn',
            'Hệ Thống', 'Huyền Huyễn', 'Dị Giới', 'Dị Năng', 'Quân Sự', 'Lịch Sử', 'Xuyên Không',
            'Xuyên Nhanh', 'Trọng Sinh', 'Trinh Thám', 'Thám Hiểm', 'Linh Dị', 'Sắc', 'Ngược', 'Sủng',
            'Cung Đấu', 'Nữ Cường', 'Gia Đấu', 'Đông Phương', 'Đô Thị', 'Bách Hợp', 'Hài Hước', 'Điền Văn',
            'Cổ đại', 'Mạt Thế', 'Truyện Teen', 'Phương Tây', 'Nữ Phụ', 'Light Novel', 'Việt Nam', 'Đoản Văn'];

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
      source: substringMatcher(genres)
  })
});