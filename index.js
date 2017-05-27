function displayBinaryStream(bits, wrap) {
    wrap = wrap || 8;
    var element = $('#output');
    element.empty();

    for (var i = 0, wrapCount = 0; i < bits.length; i++, wrapCount++) {
        if (wrapCount >= wrap) {
            wrapCount = 0;
            $('<div>').addClass('break').appendTo(element);
        }
        $('<div>').addClass(bits[i] ? 'one' : 'zero').appendTo(element);
    }
}

/**
 * Parse hex text into a list of decimal values
 * @param  {string} text
 * @return {number[]}
 * @throws {Error} If invalid hex characters exist.
 */
function parseHexInput(text) {
    var list = [];

    var parts = text.split(' ');
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        
        if (part == '') {
            continue;
        }

        if (part.startsWith('0x')) {
            part = part.substr(2);
        }

        if (!part.match(/[0-9a-fA-F]{2}/)) {
            throw new Error('Invalid hex at block ' + i + ', "' + part + '" is not composed of 2 hex characters.');
        }

        var dec = parseInt(part, 16);
        list.push(dec);
    }

    return list;
}

function pushBits(list, octet, checks) {
    for (var i = 7; i >= 0; i--) {
        if (checks[i]) {
            var bit = octet & (1 << i) ? 1 : 0;
            list.push(bit);
        }
    }
}

function toBitList(decList, checks) {
    var bitList = [];
    for (var i = 0; i < decList.length; i++) {
        pushBits(bitList, decList[i], checks);
    }
    return bitList;
}

function getChecks() {
    var list = [];
    for (var i = 0; i < 8; i++) {
        list[i] = $('#inputBit' + i).prop('checked');
    }
    return list;
}

function updateGrid () {
    var dec = parseHexInput($('#inputHex').val().trim());
    var bits = toBitList(
        dec,
        getChecks());
    for (var i = 0; i < $('#inputOffset').val(); i++) {
        bits.unshift(false);
    }

    var wrap = $('#inputWrap').val();

    displayBinaryStream(bits, wrap);
}

$('#inputHex, .inputBit, #inputWrap, #inputOffset').change(updateGrid);
updateGrid();
