var socket = io();
socket.emit('join', location.href.split('/').pop());
var pulseStack = [];
var tapeSpeed = 3;
var typeSpeed = 150;

const sounder = new Sounder;
sounder.addFile('/se/pulse.wav','pulse');
sounder.addFile('/se/dummy.wav','dummy');
sounder.loadFile();

socket.on('receive', function(data) {
	sounder.playSound('pulse')
    var $dot = $('<div class="dot"/>');
    var right = 0;
    $dot.css({
        right
    });
    $('.tape').append($dot);
    var timer = setInterval(() => {
        right += tapeSpeed;
        if ($('.tape').width() < right) {
            pulseStack.shift();
            clearInterval(timer)
            $dot.remove();
        } else {
            $dot.css({
                right
            });
        }
    }, 25);
    var text = tokenTape().join('');
    $('.tape').attr({'data-text':' '+text})
    pulseStack.push($dot);
});
$('#pulse').click(() => {
	sounder.playSound('dummy');
    socket.emit('code');
})
var dict = {
    "a": "10111",
    "b": "111010101",
    "c": "11101011101",
    "d": "1110101",
    "e": "1",
    "f": "101011101",
    "g": "111011101",
    "h": "1010101",
    "i": "101",
    "j": "1011101110111",
    "k": "111010111",
    "l": "101110101",
    "m": "1110111",
    "n": "11101",
    "o": "11101110111",
    "p": "10111011101",
    "q": "1110111010111",
    "r": "1011101",
    "s": "10101",
    "t": "111",
    "u": "1010111",
    "v": "101010111",
    "w": "101110111",
    "x": "11101010111",
    "y": "1110101110111",
    "z": "11101110101",
    "1": "10111011101110111",
    "2": "101011101110111",
    "3": "1010101110111",
    "4": "10101010111",
    "5": "101010101",
    "6": "11101010101",
    "7": "1110111010101",
    "8": "111011101110101",
    "9": "11101110111011101",
    "0": "1110111011101110111",
    ".": "10111010111010111",
    ",": "1110111010101110111",
    "?": "101011101110101",
    "!": "1110101110101110111",
    "-": "111010101010111",
    "/": "1110101011101",
    "@": "10111011101011101",
    "(": "111010111011101",
    ")": "1110101110111010111",
    " ": "0"
}

function conv(word_str) {
    var strs = word_str.toLowerCase().split('');
    var rtn = "";
    for (var i = 0; i <= strs.length - 1; i++) {
        if (dict[strs[i]] === undefined) {} else {
            rtn += dict[strs[i]] + "00000";
        }
    }
    return rtn;
}

$('#chat').on('keydown',e=>{

	if(e.keyCode==13){
		var type = conv($('#chat').val()).split('').map(c=>c=='1');
		var timer = setInterval(()=>{
			if(type.shift()){
				socket.emit('code');
			}
			if(type.length==0){
				clearInterval(timer)
			}
		},typeSpeed)
	}
})

jQuery(document).ready(function() {
    // ime-modeが使えるか
    var supportIMEMode = ('ime-mode' in document.body.style);
    // 1バイト文字専用フィールド
    jQuery('#chat').on('keydown blur paste', function(e) {
        // ime-modeが使えるならスキップ
        if (e.type == 'keydown' || e.type == 'blur')
            if (supportIMEMode) return;
        // 2バイト文字が入力されたら削除
        var target = jQuery(this);
        window.setTimeout(function() {
			var replaced = target.val().split('').filter(c=>c in dict).join('');
            target.val(replaced);
        }, 1);
    });
});

function tokenTape(){
	var positionStack = pulseStack.map(el=>parseInt(el.css('right').slice(0,-2))).reverse();
	var slicer = parseInt($('.tape').width()/(1/25*typeSpeed))
	var tokenStack = Array(slicer).fill(0).map((e,i)=>{
		if(!positionStack.length){
			return false;
		}
		if(positionStack[0] < i * (1/25*typeSpeed)){
			positionStack.shift();
			return true;
		}else{
			return false;
		}
	})
	var tokenStr = tokenStack.map(i=>i?'1':'0').reverse().join('');
	tokenStr = tokenStr.replace(/.$/,'1')
	tokenStr = tokenStr
		.replace(/100/g,'10')
		.replace(/1001/g,'101')
		.replace(/10101/g,'2')
		.match(/^0*(.*)0*$/)[1]
		.replace(/10{5,}/g,'1|')
		.replace(/20{5,}/g,'2|')
		.replace(/0{1,4}/g,'0')
		console.log(tokenStr)
	var patterns = tokenStr.split('|');
	var ret = patterns.map(t=>{
		return t.replace(/2/g,'111')
	}).map(t=>{
		var key = Object.keys(dict).find(key=>{
			return dict[key] == t
		});
		return key||'■'
	})
	return ret;
}