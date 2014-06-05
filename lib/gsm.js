//Inspired from https://messente.com/sms/calculator

var charset7bit = {'@': 1, '£': 1, '$': 1, '¥': 1, 'è': 1, 'é': 1, 'ù': 1, 'ì': 1, 'ò': 1, 'Ç': 1, "\n":1, 'Ø': 1, 'ø': 1, "\r":1, 'Å': 1, 'å': 1, 'Δ': 1, '_': 1, 'Φ': 1, 'Γ': 1, 'Λ': 1, 'Ω': 1, 'Π': 1, 'Ψ': 1, 'Σ': 1, 'Θ': 1, 'Ξ': 1, 'Æ': 1, 'æ': 1, 'ß': 1, 'É': 1, ' ': 1, '!': 1, '"': 1, '#': 1, '¤': 1, '%': 1, '&': 1, "'":1, '(': 1, ')': 1, '*': 1, '+': 1, ',': 1, '-': 1, '.': 1, '/': 1, '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, ':': 1, ';': 1, '<': 1, '=': 1, '>': 1, '?': 1, '¡': 1, 'A': 1, 'B': 1, 'C': 1, 'D': 1, 'E': 1, 'F': 1, 'G': 1, 'H': 1, 'I': 1, 'J': 1, 'K': 1, 'L': 1, 'M': 1, 'N': 1, 'O': 1, 'P': 1, 'Q': 1, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 1, 'W': 1, 'X': 1, 'Y': 1, 'Z': 1, 'Ä': 1, 'Ö': 1, 'Ñ': 1, 'Ü': 1, '§': 1, '¿': 1, 'a': 1, 'b': 1, 'c': 1, 'd': 1, 'e': 1, 'f': 1, 'g': 1, 'h': 1, 'i': 1, 'j': 1, 'k': 1, 'l': 1, 'm': 1, 'n': 1, 'o': 1, 'p': 1, 'q': 1, 'r': 1, 's': 1, 't': 1, 'u': 1, 'v': 1, 'w': 1, 'x': 1, 'y': 1, 'z': 1, 'ä': 1, 'ö': 1, 'ñ': 1, 'ü': 1, 'à': 1, "\f": 2, '^': 2, '{': 2, '}': 2, '\\': 2, '[': 2, '~': 2, ']': 2, '|': 2, '€': 2};

function smsCount(chars, enc_16) {
	var characters_left = 0;
	var sms_count = 0;
	
	if (!enc_16 && chars <= 160) {
		characters_left = 160 - chars;
		return {
			'sms_count'		: 1,
			'chars_left'	: characters_left,
			"char_set"		: "GSM 03.38"
		};
	}
	
	if (enc_16 && chars <= 70) {
		characters_left = 70 - chars;
		return {
			'sms_count'		: 1,
			'chars_left'	: characters_left,
			"char_set"		: "Unicode"
		};
	}
	
	if (!enc_16) {
		sms_count = Math.ceil(chars / 153);
		characters_left = (sms_count * 153) - chars;
		return {
			'sms_count'		: sms_count,
			'chars_left'	: characters_left,
			"char_set"		: "GSM 03.38"
		};
	} else {
		sms_count = Math.ceil(chars / 67);
		characters_left = (sms_count * 67) - chars;
		return {
			'sms_count'		: sms_count,
			'chars_left'	: characters_left,
			"char_set"		: "Unicode"
		};
	}
}

module.exports = function(content) {
	var matches = content.split("");
	
	var use_7bit = true;
	var length_7bit = 0;
	var length_16bit = 0;
	
	for (var i=0; i<matches.length; i++) {
		var charToCheck = matches[i];
				
		if (use_7bit && charset7bit[charToCheck] === undefined) {
			use_7bit = false;
		}
				
		if (use_7bit) {
			length_7bit += charset7bit[charToCheck];
		}
				
		length_16bit++;
	}
	
	if (use_7bit) {
		parts = smsCount(length_7bit, false);
	} else {
		parts = smsCount(length_16bit, true);
	}
	
	return parts;
};