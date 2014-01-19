/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, jquery:true */

var halfdane = halfdane || {};
halfdane.picture_display = halfdane.picture_display || (function () {
    'use strict';

    function createFrame($target, adjustedWidth, adjustedHeight) {
        var ottoLogo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF0aIE_awrS2dM7y36nR9s7yMFIW4Bkvyy_B8Swe9hsv419_gtwQ';
        $('<span></span>')
            .addClass('panel')
            .appendTo($target)
            .height(adjustedHeight)
            .width(adjustedWidth)
            .append($('<img>').addClass('front').attr('src', ottoLogo))
            .append($('<img>').addClass('back').attr('src', ottoLogo));
    }

    function showInFrame($frame, imgUrl) {
        var nextImage;
        if ($frame.hasClass('flip')) {
            nextImage = $frame.children('.front');
        } else {
            nextImage = $frame.children('.back');
        }
        nextImage.attr('src', imgUrl).on('load', function () {
            $frame.toggleClass('flip');
        });
    }

    function show($target) {
        return function (imgUrl) {
            var $elements = $target.find('.panel');
            var randomIndex = Math.floor(Math.random() * $elements.length);
            showInFrame($($elements.get(randomIndex)), imgUrl);
        };
    }

    function init($targetElement) {
        var testDiv = $('<span></span>').addClass('panel').appendTo('body');
        var inRow = Math.floor($targetElement.width() / testDiv.width());
        var inCol = Math.floor($targetElement.height() / testDiv.height());

        testDiv.remove();

        var adjustedWidth = $targetElement.width() / inRow;
        var adjustedHeight = $targetElement.height() / inCol;

        var frameCount = inRow * inCol;
        var i;
        for (i = 0; i < frameCount; i += 1) {
            createFrame($targetElement, adjustedWidth, adjustedHeight);
        }

        return {
            show: show($targetElement)
        };
    }

    return {
        init: init
    };
}());

halfdane.picture_demo = halfdane.picture_demo || (function () {
    "use strict";

    var keepRunning;
    var demoDiv;

    function showIndexOfArray(index, pictureDisp, sleep, givenFunction) {
        var array = halfdane.pictures;
        pictureDisp.show(array[index]);

        if (index >= array.length) {
            index = -1;
        }
        setTimeout(function () {
            var reloadingFunction = givenFunction || showIndexOfArray
            reloadingFunction(index + 1, pictureDisp, sleep, reloadingFunction);
        }, sleep);
    }

    function showIndexOfArrayWithStop(index, pictureDisp, sleep) {
        if (!keepRunning) {
            demoDiv.remove();
            return;
        }

        showIndexOfArray(index, pictureDisp, sleep, showIndexOfArrayWithStop);
    }

    function runFullscreen() {
        demoDiv = $('<div></div>')
            .addClass('picture_demo')
            .appendTo('body');
        keepRunning = true;

        showIndexOfArrayWithStop(0, halfdane.picture_display.init(demoDiv), 2);

        demoDiv.focus();
        demoDiv.on('click', function () {
            keepRunning = false;
        });

        $(window).on("keydown", function () {
            keepRunning = false;
        });
    }

    $(window).on('load', function() {
        showIndexOfArray(0, halfdane.picture_display.init($('.small_picture_demo')), 50);
    });

    return {
        run: runFullscreen
    };
}());


halfdane.pictures = [
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQKpuqYCjVqhcgmrnHiYXbaWcH1amrFAVvFUX7oMDaU70N4COSEYg",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQcl8yKJ0mbTVz0jKeKy5Pr8VnchRv46uCX50Qb6VpbzBahKxiuuA",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJK9JW-u13AZRAqKu2QcCO7G8PrqA566gz2lsMS2NdypYy5kwRxw",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSEWAwW1D_IiD_Q46TzUe7CxNsv2pQHel2rMjot2ExunV3X8yBCAA",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS5FlOYL9mqAeqylW8VDXAga_2KtX-Nxb9gxxbGb2sVYSZv4UJngg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHMK2us9XS79Fq5Um7azH2yA_jEIamiBJ5X3d3HpSpiD4QSp00Wg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTi3kRL-mgo7Kl2enHQlL64Ds6moKBk00Hi6JHd0dus-EUg9hkj",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRtyIsQ9Vi9EWib5fjFHO6nMxnkxlrG0dSA_yYPJngQ8fRSCXIvOw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgkYvRDM-wjjYC_5JwmfGMZ_DFs6n0VjJWikxXRPkBg5TGn8sqwg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSgckWIZFx4dTs5W95vBFuK_BcVm2cPgq37kXSobtYqsC2RKna6_w",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ_x7WL891znA4EJFWU56cyIWbTUMO5RebQ7PvOFlX-tVlWK1a1",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT3HW08vfnj2PE9liPONGkNUhMkrzW3gC67G0h_8HXmQCaxn2On",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPpsIZwJpsRPM9INmpZJlLzgNUecj2qPadSjgUMdeWgXeegfkeMw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtOkrDTFGo9uLI2V5fR_ObGrFETLT00c0V9_99sJF0JlKANWct",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRi1WjqPBkXWGupMn0gOMxBGMvlDamvLyjptkm5vPcUGL360WavbA",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX7rlSMrBeGqhHxjS8XjL3k0FQ7YzCBZgUil5ztQlPipzk1iC2",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcScXIDDS8Cnulv0ZgWZAqlP7i2obULzEBnbn2UtvPNw_mrmKQaCWw",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRdl9admvENR72vq4bDrPZOEZRJ-l9bC39Ys0IZCGgwB9xeIetP",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS0G2OYM8Q7VykxfLKyDvPC0yA-DxltccFSyXLD0hnTgT_T4Tjygg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSbHOgVS_uHQDaMmEIAnRWGsgJvCS3BGoHj3AZedYm4lVorEJSr",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTiFlo2FmWJGXAql3sYociJaQ7H6FOsn7BxTSpeTRcgwLLIEU2bRQ",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRRJGXOJ-luj4AJLiDTOZVFnPmDBldF7CBG84diHCvTVcMQ_XNLCA",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTcBUpzsNEZUnOZnbtDc82cLRUXDZ7hgOabfqAkmD-T3QSwXMc7ug",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSulEBZ7qjvvgBhqxPlNXip83H0lg2i9tm8VnC8tomQoLhvg0IP",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS2Teqlm8sQAKQK4V30bBv_1FlHlXBthuYhnB1nejKxCNJiEdhgcQ",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRFUaYCcUgr83AW0tWzcD0kEYpT2_hKOet0efm_7fNA9MCILCF_Kw",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQPUi9G2CO0WA-5PzAQg4uLycXBubx8Mj0rpXh4EZVeG4WWHPOIsA",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnWljZL7hfrLRy5M2KHiOx4PxqaafAs0hvBd3D6b1dbQ7x84ZN",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS5_f_aIs-fLsMSDKymLdqotoduZcL2Rxk8xeLlZbTg9X8IKvzjpQ",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRRhbMAfoQK7f7Nr-sscB9vBd9a3yRm1FJ08lFDAriR8xTgNpLbGA",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmnxm6rV66zPzAfXACm7iEyCEs6lVBT_E7VnyZEH8eyGE5bIJ",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9xp4bvdm1qEzubMJUdDdEWZOaaWGVbyQLV4Xxi2lsIzInPOUGmw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1MZzilCLjKDos5b9qs3mWHp0_d4PY_P14hY609j54s1CvZL5",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGvPDZT7lCeUsUIJ2fecmwXClY2nawgmE_a8SG1SEK2UT9yhrM",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRsc2inbW5--tpEQny9wo6falNuJq1KXbWUiAypGZXDL1aS7qN4",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSC49qU_l46b8cOrYHFDVqqOoXefaC3PPiS6yFOdfD9kC1N3I-sLg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR-49Uio0khSU8RzWgjuSEy_hpkk7D3xuF8rZrM_SJKXmICBldG7w",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpD6WqAFqArkY-YN61dGL_6slLjc5LlajZqkJefic8Vh8i9mTg",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSYZGcwTx6Ijytqs0AUJzk0vWT2V-zfFlOAckgoK7YdiAa00zIHXw",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT7Hix5EzpkitLvELF1mHN6oDh-XSVShXVSspELc-KqXBUQkTI1Tg",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT3t7tZPvWawG30P1zC_gVssbync9B2DpyBnlu8QR4ZfV-bWllx2w",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQcop5yIDi-0nHXmQ339imMIR82yqRjHYUzQsT9-rEdLJaWFQEQ",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3k0hTQnF3zO8C3Y0kKgqPSPCxIDAOliFVntcQ3FZW3_wy441cKg",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQwlYOR0_aopxl2Yr7rDIOcXJmardx4quWDCamezSt9QhDw2tn4",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRt0uIOdIWiOrd577A1w7slxDhXiWS_-AnCm5fFreZ5KwKswVthwA",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ17Ef2agaxErYVKAy6bnbQURK8nq1fz0qdTqvZB1l6U8IFShGM",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp7RY70VXkdt7_SISGtoalJTxh0EHEhxr3LsOB2HFRPhh9JBWqdg",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQSu6ZWfdqiJbD8KO00j29MDU0IPwP8nK58lGR_nWfCf-VFGMg1Hw",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRjPPMbLT7alustAqJLkdaLvOkNKSF_pKwmCWgKy2XbxnlsPm-X1w",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSbwVsLcnPKfm0sMD48Sm2X3HoxrJEig6QPPh0QaR47YwkXIZ2I",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRRBbSQcL8RDqxC3zoLpw2JbVdcaNFxhdWaAfUTK9JvAFzuxWheBA",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSn0kEX6JYk0oTVrvzn8AA5_XnJ3GUi5NDmrx3YIr1htWEfSRE9",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7uJkCrHyrvC6bWvYWzaGrGbWmteNTnF_6dsi3IwHwsKjBi5AwhQ",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTzofyHWtCpIcgPKlD7dm93C59JtvwDapFLLIrgPixY-oYjCKjw8Q",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTVGHQ6mlNqI6B7TGedGQughfo4SDueJSLbVFbe7D6R7oudYuKanw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdc9VJDz323sjnK6BYVrLkMDmNAF-zrFdMzNJe_cuLKEJqGzIo",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTRwTVuX9NUz4Qscy33L5QwySMuTGwMKRnVN-3xNcDGwau7oswf",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR2-G1idDBucYV921WstgUkwpxrukpNo0k-z2pPMAROutfNS-SY",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ_KKi-wQd96n0grer6yxValXz7QY_lQ07kudKwsy5r3TcxsOvvWQ",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_FBM8Qrtw74XA96Ilop2qbwX2kkwgtler9yWUbfv3Eok_7Xmc",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRbS0MaINFVI1GI6sSGcdrsxYyG3335IwTPPbhEDkCDPcNBIDUdig",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTBgRJ47k2LO1RroDkXCeDBsJzDcXvIul_aQMr2xCsWs7SPAfl3",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0XzFnEITEpvEMaakWGkLDUeTLNRsy0yCCvsaFQV9MyPHITEF0lw",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSyZ0Ox2UGHfggyYE28WnaWOlxufOBdgEp47MXIVHeZtcefUbME",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQYzzNUDeEMXc4eDlIk_Xiw-W1fYXo0mLTD9vv30e_mLa6MmnuT",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSlE1HbtB-4h1dg7rlgEMk1pkpUUT9JGjp0dvsHvYPywotYHyZKxw",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQmW1dCAm2Awjl2yzqOd90B9J3tl1h_DyD5q2Aw10TZtQX2pDkQ",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRlytX0oFaaRnUOj9oetLLBk0A9F_vqSor8mg75BdiF3ZD4kUNIFQ",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTqwYaKFN67R2QEr8j7PPGbQ0gvf4mSWK9_xOlx1cUOJB5fcjVY",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQvCnF1O1rf9i5rS_2PTyQlJFPSt2VShCd7J-xjXwxGp7XT7K69",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTIClApwQ3IMsQM05KvBnE4QzLKNS3PQUpqWMuuvtP6wtUC_BNJ0w",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQQ1bQ6jwQ7ZxmVNFUj-_9DqiVLKv738j-wuNLEXnBx2Tj1QFYxrQ",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcScmt2BRtccyEJkf8NlupQSeS8WLjZzUBT6UbB2YMaQGdFKkAAu",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRHnKmYN_u8IFZi-0azopxGTJOjYEELaiZp_cZyByg4Aem40vrX_Q",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8z8yjGlGtXnQi2BrnTUKxi6uyMfbA3fZU3T4iQLR3LjEy4UItCw",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRo_DcuJo3nWjQeK5oDux1ixHZVmcO0xxg2DY8Gp-WOJMTdWl88pg",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRWSCu9Eji8pzmTJErt_ki-cIhwKZKIRcQPhQIxgs-MDZ8mZasO",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_w6DTuyUhEAGPy5OLjVBeDHCpRXIwwfu7_RuofU5YrowHhYqiZg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQevMBEk_EtSHV1s9fUeroKbvuNyvVtQZ8Swq9ZaSALBarzoO7s4g",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQW_rEV1YKk7P5en_LwUNEg6z-nEj5d2WF2hj7R2Gs40Po9-L_7lQ",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbqE6u46LESHchb9ZoJXi_InUFvYk5nkddYCb7UB6L_nYf-CdZ",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTSHZFcQUEo90GLZhO92LWAxUEX7eiILBIiPTG44Y50dHi4ITUQfg",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTTngFmnyilkCGQkFohI5nNg-goKmhQwjJhIAIFqfiiXDIe0gks",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSRHGoKej3zGgr8zT3oRZygW3gD9OMWtiawxdm0TFMGAO2DeSMy",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQoF3HH05-MSzCoTg-ftQgNeL7Z3lgl21ucuHCL6kJYjUJOC-SOpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTShRa-o4lZnRlC1OXK5JLdlP7qwVUvh0S8wNWq91jjQJoYu676zw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZyC_PQrI2tD-k4V-L23qjrJEMko7LtCVbreZd-89D0oBSTNm03A",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSKAUDBBXljuxps-_CIsgupHz2WbeLGlmDKHvpmxE6wf9iqJVUn",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSFi3Ur4V7OndDsjpBVPffe6cHE7Wxc707VaYftKbTXwzsM_Rux",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTb4fWKT6F9aS6IRV07Z6ru77Ou3EJjnjqmXMcg4drRLaL0xATg",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQy27IOY1iOpYrVNDEZFkYhVIiAE0kya5HrrqJl_fmBD54bKEQS",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSY73ycJwrweKFpndM5GRVaAA8SI37TpWqM_1cnM9zxRs704WZ-",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0XHFkr3j9Gbzct9qJ5pKZYSoXkm7vQfTwzMwmxn82mdb-mN1K",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ28lL2CmuR2PxBN_qwEETLgeDxpTiHrYIDg9hdY6O57M0GlEQD",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQCvWwKtQLxd-CrWGLl0SYZcn5CjACVBwKtQKPdtl1SkKhb5a-asw",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPB14MXzU2RWgLOtEqxITtAGNpHE7EtXZ_VwD1975wCizPzChK",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQFtG57booP7n9NwDhpJANwtAMAjy_W3v8J5ucEHS5hOdwd0dN70g",
    "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRxh8gg11VWEg-gc9DU--ciaXkUTB0FeJ2y3jY89vOSXSxqr9Zb",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTQGIoRh6_r6khfUS4CUsDtZ4zozgWmBz00c0A1NQO6iSa54bTP",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT0rDKP31HA5_cg1HE-zaPKROgNi5qrzolQEzts9ZJA250Hk8CW9A"
];

