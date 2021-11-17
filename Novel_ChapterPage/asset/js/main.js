/*show emoticon*/
var postForm = $(".postForm");

function showEmoticon(form) {
  form.find(".emoticonbt").click(function () {
    $(this).parent().find('.emotion-form').toggle();
  });
  form.find(".emotion-form a").click(function () {
    var $input = form.find(".comment-input");
    var txt = $input.val(); console.log(txt);
    $input.val(txt + $(this).text()); $(this).parent().toggle();
  });
}
$(function () { showEmoticon(postForm); });
