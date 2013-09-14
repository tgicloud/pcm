/**
 * pcm
 * makeCards
 */

// https://github.com/prusnak/papercoin/blob/master/papercoin.js#L1-L15
var print_qr = function (doc, x, y, size, text) {
  var typesize = 4;
  if (text[0] == '5') typesize = 6;
  var qr = new qrcodeGen(typesize, 'H');
  qr.addData(text);
  qr.make();
  var m = qr.getModuleCount();
  var s = size / m;
  doc.setFillColor(0);
  for (var r = 0; r < m; r++) {
    for (var c = 0; c < m; c++) {
      if (qr.isDark(r, c)) {
        doc.rect(x + c * s, y + r * s, s, s, 'F');
      }
    }
  }
};

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function demoTwoPageDocument() {
  var doc = new jsPDF();
  doc.text(20, 20, 'Hello world!');
  doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
  doc.addPage();
  doc.text(20, 20, 'Do you like that?');

  // Save the PDF
  doc.save('Test.pdf');

}

function makeCards(saveToFile) {

  var pages = parseInt(document.getElementById('makeCardPages').value);
  if (!pages || pages <1) {
    alertDanger('Must enter # of pages');
    return
  }

  var pageOrientation = 'portrait';
  var pageUunits = 'in'; // inches
  var pageFormat = 'a4'; // paper size
  var pageWidth = 8.267; // for a4
  var pageHeight = 11.692; // for a4

  var pdf = new jsPDF(pageOrientation, pageUunits, pageFormat); // unit of measure inches

  // Margins are interesting but does not really matter
  var topMargin = 0.25;
  var bottomMargin = 0.25;
  var leftMargin = 0.25;
  var rightMargin = 0.25;
//  pdf.setLineWidth(1 / 72);
//  pdf.line(leftMargin, topMargin, pageWidth - rightMargin, topMargin);
//  pdf.line(leftMargin, topMargin, leftMargin, pageHeight - bottomMargin);
//  pdf.line(leftMargin, pageHeight - bottomMargin, pageWidth - rightMargin, pageHeight - bottomMargin);
//  pdf.line(pageWidth - rightMargin, topMargin, pageWidth - rightMargin, pageHeight - bottomMargin);

//  // Font crap
//  var fontX = 0.5;
//  var fontY = 0.5;
//  pdf.text(fontX, fontY, 'This is the default font.');
//  fontY += 0.25;
//
//  pdf.setFontSize(22);
//  pdf.text(fontX, fontY, 'This is a title');
//  fontY += 0.25;
//
//  pdf.setFontSize(12);
//  pdf.text(fontX, fontY, 'This is some normal sized text underneath.');
//  fontY += 0.25;
//
//
//  pdf.setFont("courier");
//  pdf.setFontType("normal");
//  pdf.text(fontX, fontY, 'This is courier normal.');
//  fontY += 0.25;
//
//  pdf.setFont("times");
//  pdf.setFontType("italic");
//  pdf.text(fontX, fontY, 'This is times italic.');
//  fontY += 0.25;
//
//  pdf.setFont("helvetica");
//  pdf.setFontType("bold");
//  pdf.text(fontX, fontY, 'This is helvetica bold.');
//  fontY += 0.25;
//
//  pdf.setFont("courier");
//  pdf.setFontType("bolditalic");
//  pdf.text(fontX, fontY, 'This is courier bolditalic.');
//  fontY += 0.25;


  // For cards...
  var sideMargin = 0.748031;
  var topMargin = 0.511811;
  var cardsAcross = 2;
  var cardsDown = 5;
  var cardSizeHeight = 2.0;
  var cardSizeWidth = 3.5;
  var horizontalGap = 0.1;
  var VerticalGap = 0.1;

  // Now print each card
  for (var page = 0; page < pages; page++) {
    if (page)
      pdf.addPage();
    for (var top = 0; top < cardsDown; top++) {
      for (var left = 0; left < cardsAcross; left++) {
        var cardTop = topMargin + (top * (cardSizeHeight + VerticalGap));
        var cardLeft = sideMargin + (left * (cardSizeWidth + horizontalGap));
        var cardBottom = cardTop + cardSizeHeight;
        var cardRight = cardLeft + cardSizeWidth;

        // Draw card border
        pdf.setLineWidth(1 / 72);
        pdf.line(cardLeft, cardTop, cardRight, cardTop);
        pdf.line(cardLeft, cardTop, cardLeft, cardBottom);
        pdf.line(cardRight, cardTop, cardRight, cardBottom);
        pdf.line(cardLeft, cardBottom, cardRight, cardBottom);

        // Title
        pdf.setFontSize(20);
        pdf.setFont("helvetica");
        pdf.setFontType("bold");
        pdf.text(cardLeft + 0.1, cardTop + 0.3, 'Private Club Membership');

        // Rules etc
        pdf.setFontSize(10);
        pdf.setFont("times");
        pdf.setFontType("italic");
        for (var i = 0; i < 8; i++)
          pdf.text(cardLeft + 1.55, cardTop + 0.6 + (i * 0.15), 'You can put rules here if wanted.');

        // QR
        var theCode = makeid();
//        console.log(theCode);
        print_qr(pdf, cardLeft + 0.2, cardTop + 0.5, 1.25, theCode);

      }
    }
  }


  // Draw frame for total page margins


//  doc.rect(20, 20, 10, 10); // empty square
//
//  doc.rect(40, 20, 10, 10, 'F'); // filled square
//
//  doc.setDrawColor(255, 0, 0);
//  doc.rect(60, 20, 10, 10); // empty red square
//
//  doc.setDrawColor(255, 0, 0);
//  doc.rect(80, 20, 10, 10, 'FD'); // filled square with red borders
//
//  doc.setDrawColor(0);
//  doc.setFillColor(255, 0, 0);
//  doc.rect(100, 20, 10, 10, 'F'); // filled red square
//
//  doc.setDrawColor(0);
//  doc.setFillColor(255, 0, 0);
//  doc.rect(120, 20, 10, 10, 'FD'); // filled red square with black borders
//
//  doc.setDrawColor(0);
//  doc.setFillColor(255, 255, 255);
//  doc.roundedRect(140, 20, 10, 10, 3, 3, 'FD'); //  Black sqaure with rounded corners


  if (saveToFile) {
    pdf.save('Test.pdf');
  } else {
    pdf.output('dataurlnewwindow');
  }

}