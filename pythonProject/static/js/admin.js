const requestURL = 'http://127.0.0.1:3000/api/snacks/'

//функция отправки запросов
function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        //соединение с сервером
        xhr.open(method, url)
        //настройки обмена данных
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')
        //обработчик событий
        xhr.onload = () => {
            if (xhr.status >= 400) {
              reject(xhr.response)
            } else {
              resolve(xhr.response)
            }
        }
        //обработчик ошибок
        xhr.onerror = () => {
          reject(xhr.response)
        }
        //отправка запроса
        xhr.send(JSON.stringify(body))
    })
}

// глобальный таймер, проверка на пополнение
var timer,
accepter_plus = 0,
accepter_minus = 0,
accepter_fill = 0

$(document).ready(function(){
    //обработчик клика по блоку с классом numpad__row_btn
    $('div.numpad__row_btn').click(function(){
        window.clearTimeout(timer);
        $( "div.admin-fill_accept" ).fadeOut();
        //текущее содержание импута
        var text = $('input').val();
        //что хотим сделать
        var qwe = $(this).text();
        //очистка циферблата
        if (qwe == "C"){
            $('input').val("");
            $('.admin-clue').text(0);
            $('.admin-clue').fadeOut();
        }
        //удаление последней цифры
        else if (qwe == "<"){
            text = text.slice(0, -1)
            $('input').val(text);
            $('.admin-clue').text(0);
            $('.admin-clue').fadeOut();
        }
        else if ((text.length < 2) && (parseInt(text) != 0))
            $('input').val(text + qwe);
        text = $('input').val();
        if ((parseInt(text) > 35) || (parseInt(text) == 0)){
            setTimeout(() => {
                alert("Введен неверный номер ячейки");
            }, "50");
            //если введен некорректный номер ячейки
            $('div.numpad__row_btn-num').css({'opacity':'0.33', 'transition-duration':'0.5s'});
        }
        else
            //если на данный момент в инпуте корректный номер
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
            $('div.admin-plus_amount').css({'opacity':'0.33', 'transition-duration':'0.5s'});
            $('div.admin-minus_amount').css({'opacity':'0.33', 'transition-duration':'0.5s'});
            if ((parseInt(text) <= 35) && (parseInt(text) > 0)){
                timer = window.setTimeout(() => {
                    $('div.numpad__row_btn-num').css({'opacity':'0.33', 'transition-duration':'0.5s'});
                    sendRequest('PUT', requestURL + text, {change: 0})
                        .then(data => {
                            if (data == 0){
                                alert("Нет свободного места")
                                text = $('input').val("");
                                $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
                            }
                            else{
                                alert(data + " свободных ячеек")
                                $('div.admin-plus_amount').css({'opacity':'1', 'transition-duration':'0.5s'});
                                $('div.admin-minus_amount').css({'opacity':'1', 'transition-duration':'0.5s'});
                                accepter_fill = data;
                                accepter_plus = 1;
                            }
                        })
                        .catch(err => console.log(err))
                }, "1000");
            }
    });
    $('div.admin-plus_amount').click(function(){
        if (parseInt(text = $('input').val()) > 0){
            if (accepter_plus == 1){
                $('.admin-clue').fadeIn();
                text = $('.admin-clue').text();
                qwe = parseInt(text) + 1;
                $('.admin-clue').text('+' + qwe);
                accepter_minus = 1;
                if ((accepter_fill >= qwe) && (qwe > 0)){
                    $( "div.admin-fill_accept" ).fadeIn();
                }
                else
                    $( "div.admin-fill_accept" ).fadeOut();
            }
        }
    });
    $('div.admin-minus_amount').click(function(){
        if (accepter_minus == 1){
            text = $('.admin-clue').text();
            qwe = parseInt(text) - 1;
            $('.admin-clue').text('+' + qwe);
            if (qwe == 0){
                accepter_minus = 0;
                $('.admin-clue').fadeOut();
            }
            if ((accepter_fill >= qwe) && (qwe > 0)){
                $( "div.admin-fill_accept" ).fadeIn();
            }
            else
                $( "div.admin-fill_accept" ).fadeOut();
        }
    });
    $('div.admin-fill_accept').click(function(){
        text = $('input').val();
        qwe = parseInt(text);
        accepter_plus = 0
        accepter_minus = 0
        accepter_fill = 0
        sendRequest('PUT', requestURL + text, {change: qwe})
        .then(data => {
            alert("Ячейка пополнена");
            $('input').val("");
            $('.admin-clue').text(0);
            $('.admin-clue').fadeOut();
            $('div.admin-fill_accept').fadeOut();
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
        })
        .catch(err => {
            alert("Произошла ошибка, обратитесь в тех. поддержку")
            $('input').val("");
            $('.admin-clue').text(0);
            $('.admin-clue').fadeOut();
            $('div.admin-fill_accept').fadeOut();
            $('div.numpad__row_btn-num').css({'opacity':'1', 'transition-duration':'0.5s'});
        })
    });
});