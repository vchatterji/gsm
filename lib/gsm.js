//Inspired from https://messente.com/sms/calculator

var charset7bit = {'@': 1, '£': 1, '$': 1, '¥': 1, 'è': 1, 'é': 1, 'ù': 1, 'ì': 1, 'ò': 1, 'Ç': 1, "\n":1, 'Ø': 1, 'ø': 1, "\r":1, 'Å': 1, 'å': 1, 'Δ': 1, '_': 1, 'Φ': 1, 'Γ': 1, 'Λ': 1, 'Ω': 1, 'Π': 1, 'Ψ': 1, 'Σ': 1, 'Θ': 1, 'Ξ': 1, 'Æ': 1, 'æ': 1, 'ß': 1, 'É': 1, ' ': 1, '!': 1, '"': 1, '#': 1, '¤': 1, '%': 1, '&': 1, "'":1, '(': 1, ')': 1, '*': 1, '+': 1, ',': 1, '-': 1, '.': 1, '/': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, ':': 1, ';': 1, '<': 1, '=': 1, '>': 1, '?': 1, '¡': 1, 'A': 1, 'B': 1, 'C': 1, 'D': 1, 'E': 1, 'F': 1, 'G': 1, 'H': 1, 'I': 1, 'J': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'O': 1, 'P': 1, 'Q': 1, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 1, 'W': 1, 'X': 1, 'Y': 1, 'Z': 1, 'Ä': 1, 'Ö': 1, 'Ñ': 1, 'Ü': 1, '§': 1, '¿': 1, 'a': 1, 'b': 1, 'c': 1, 'd': 1, 'e': 1, 'f': 1, 'g': 1, 'h': 1, 'i': 1, 'j': 1, 'k': 1, 'l': 1, 'm': 1, 'n': 1, 'o': 1, 'p': 1, 'q': 1, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 1, 'w': 1, 'x': 1, 'y': 1, 'z': 1, 'ä': 1, 'ö': 1, 'ñ': 1, 'ü': 1, 'à': 1, "\f": 2, '^': 2, '{': 2, '}': 2, '\\': 2, '[': 2, '~': 2, ']': 2, '|': 2, '€': 2};

function isUnicode(content) {
	var chars = content.split("");
	var isUnicode = false;
	
	chars.forEach(function(c) {
		if(!charset7bit[c]) {
			isUnicode = true;
		}
	});
	return isUnicode;
}

function getTotalLengthGSM(content) {
	var chars = content.split("");
	var char_length = 0;
	
	chars.forEach(function(c) {
		char_length += charset7bit[c];
	});
	return char_length;
}

module.exports = function(content) {
	if(!content) {
		return {
			'sms_count'		: 0,
			'chars_left'	: 160,
			"char_set"		: "GSM 03.38",
			"parts"			: []
		};
	}
	
	var is_unicode = isUnicode(content);
	var parts = [];
	
	var chars = content.split("");
	
	if(!is_unicode) {
		var total_length = getTotalLengthGSM(content);
		if(total_length <= 160) {
			return {
				'sms_count'		: 1,
				'chars_left'	: 160 - total_length,
				"char_set"		: "GSM 03.38",
				"parts"			: [content]
			};
		}
		else {
			var parts = [];
			var max_length = 153;
			var current_length =0;
			
			var part = "";
			chars.forEach(function(c) {
				if(current_length + charset7bit[c] <= max_length) {
					part += c;
					current_length += charset7bit[c];
				}
				else {
					parts.push(part);
					part = "";
					part += c;
					current_length = charset7bit[c];
				}
			});
			
			if(part) {
				parts.push(part);
			}
			
			return {
				'sms_count'		: parts.length,
				'chars_left'	: max_length - getTotalLengthGSM(parts[parts.length - 1]),
				"char_set"		: "GSM 03.38",
				"parts"			: parts
			};
		}
	}
	else {
		if(content.length <= 70) {
			return {
				'sms_count'		: 1,
				'chars_left'	: 70 - content.length,
				"char_set"		: "Unicode",
				"parts"			: [content]
			};
		}
		else {
			var sms_count = Math.ceil(content.length / 67);
			var parts = [];
			var max_length = 67;
			
			for(var i=0; i<sms_count; i++) {
				part = content.substring(i*max_length, i*max_length + max_length);
				parts.push(part);
			}
			return {
				'sms_count'		: parts.length,
				'chars_left'	: max_length - parts[parts.length - 1].length,
				"char_set"		: "Unicode",
				"parts"			: parts
			};
		}
	}
};