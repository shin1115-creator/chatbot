// テキストエリアのサイズの自動リサイズ
$(function(){
    $('textarea.auto-resize')
    .on('change keyup keydown paste cut blur', function(){
        if ($(this).outerHeight() > this.scrollHeight){
            $(this).height(1);
        }
        while ($(this).outerHeight() < this.scrollHeight){
            $(this).height($(this).height() + 1);
        }
    });
});

$(function(){
    // Lv.3:➀ボタンのidを指定しよう ➁クリックで反応するようにしよう
    $('#chat-btn').on('click', function(){
        // テキストエリアに何も入力されていない場合は何もしない
        if(!$('#chat-text').val()) return;
        // Lv.3,4が出来たら20行目の「//」を消してね
        chatAreaInputed();
        // Lv.5が出来たら22行目の「//」を消してね
        chatbotRequest();
        autoScrollChatArea();
        resetChatText();

        // テキストエリアのサイズを調整
        if (1 < $('textarea.auto-resize').outerHeight() ){
            $('textarea.auto-resize').height(11);
        }
    });
});

// チャットエリアに入力した内容を追加
function chatAreaInputed() {
    if ($('textarea[id="chat-text"]').val() != '') {
        // Lv.4:➀テキストエリアに入力した内容を取得しよう
        var chatText = $('textarea[id="chat-text"]').val();
        chatText = chatText.replace(/\r?\n/g, '<br />');
        // Lv.4:➁ul要素に追加しよう Lv.4:➂取得した内容を表示するようにしよう
        $('ul').append('<li class="user">' + chatText+ '</li>');
    }
}

function apiResponseInputed(text) {
    // Lv.6:ChatBotから返ってきた内容を表示しよう
    $('ul').append('<li class="gemini">' + text + '</li>');
}

// チャットエリアに新しく追加した項目に自動スクロール
function autoScrollChatArea() {
    var chatContents = $('#chat-area').find('li');
    // 追加したチャットの高さを取得
    var offsetTop = chatContents[chatContents.length - 1].offsetTop;
    $('#chat-area').scrollTop(offsetTop);
}

// チャットテキストのリセット
function resetChatText() {
    var chatText = $('textarea[id="chat-text"]').val();
    chatText = '';
    chatText = chatText.replace(/\r?\n/g,'');
    $('textarea[id="chat-text"]').val(chatText);
}

// Gemini API の実行
function chatbotRequest() {
    // Lv.5:➀API_KEY、➁API_URL、➂inputTextの変数をそれぞれ定義しよう
    var API_KEY = 'AIzaSyAGpPYhUeeskzW8XnAQmUftHqD7QlGhyP0';
    var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY;
    var inputText = $('textarea[id="chat-text"]').val();
    var requestBody = {
        "contents": [{"parts": [{"text": inputText}]}]
    };

    // APIの実行
    // Lv.5:API実行に必要な情報(➃url,➄type,➅contentType)をそれぞれ設定しよう
    $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
    })
    // POST通信成功時
    .done(function(response) {
        // レスポンスの内容が正しいか確認
        if (response.candidates && response.candidates.length > 0) {
            apiResponseInputed(response.candidates[0].content.parts[0].text);
            autoScrollChatArea();
        } else {
            apiResponseInputed('エラー: 正しいレスポンスがありませんでした。');
        }
    })
    // POST通信失敗時
    .fail(function(xhr, status, error) {
        console.error('APIエラー:', error);
        apiResponseInputed('エラー: 応答を取得できませんでした。');
    })
    // 成功失敗に関わらず実行
    .always(function() {
        console.log('API実行終了');
    });
}
