function parse_data() {
  var data = {
    "DnaComponent": {
      "description": "undefined",
      "annotaions": [
        {
        "SequenceAnnotation": {
          "bioStart": "29",
          "subComponent": {
            "DnaComponent": {
              "displayId": "144",
              "uri": "http://partsregistry.org/Part:BBa_B0011",
              "type": "Terminator",
              "description": "LuxICDABEG (+/-)",
              "name": "BBa_B0011"
            }
          },
          "uri": "http://sbols.org/",
          "strand": "+",
          "bioEnd": "75"
        }
      },
      {
        "SequenceAnnotation": {
          "bioStart": "101",
          "subComponent": {
            "DnaComponent": {
              "displayId": "4932",
              "uri": "http://partsregistry.org/Part:BBa_E1010",
              "type": "Coding",
              "description": "**highly** engineered mutant of red fluorescent protein from Discosoma striata (coral)",
              "name": "BBa_E1010"
            }
          },
          "uri": "http://sbols.org/",
          "strand": "+",
          "bioEnd": "782"
        }
      },
      {
        "SequenceAnnotation": {
          "bioStart": "788",
          "subComponent": {
            "DnaComponent": {
              "displayId": "4955",
              "uri": "http://partsregistry.org/Part:BBa_I14016",
              "type": "operator",
              "description": "P(Las) CIO",
              "name": "BBa_I14016"
            }
          },
          "uri": "http://sbols.org/",
          "strand": "+",
          "bioEnd": "956"
        }
      },
      {
        "SequenceAnnotation": {
          "bioStart": "962",
          "subComponent": {
            "DnaComponent": {
              "displayId": "8042",
              "uri": "http://partsregistry.org/Part:BBa_J61101",
              "type": "RBS",
              "description": "Ribosome Binding Site Family Member",
              "name": "BBa_J61101"
            }
          },
          "uri": "http://sbols.org/",
          "strand": "+",
          "bioEnd": "974"
        }
      },
      {
        "SequenceAnnotation": {
          "bioStart": "980",
          "subComponent": {
            "DnaComponent": {
              "displayId": "7587",
              "uri": "http://partsregistry.org/Part:pSB1A7",
              "type": "stickyends",
              "description": "Transcriptionally insulated high copy BioBrick plasmid",
              "name": "pSB1A7"
            }
          },
          "uri": "http://sbols.org/",
          "strand": "+",
          "bioEnd": "3411"
        }
      }
      ],
      "uri": "http://sbol.org/",
      "DnaSequence": {
        "nucleotides": "GAATTCG",
        "uri": "http://sbols.org/"
      },
      "displayId": "undefined",
      "name": "undefined"
    }
  };
  var img = new Array();
  for (var i = 0; i < data.DnaComponent.annotaions.length; i++) {
    img[i] = new Image();
    img[i].src =
      "../static/img/component/"+data.DnaComponent.annotaions[i].SequenceAnnotation.subComponent.DnaComponent.type+".PNG" 
  }
  return img;
}

var interval = 50;
var horizon = 50;
var img = parse_data();
function draw(cxt, horizon) {
}
window.onload=function() {
  var c=document.getElementById("myCanvas");
  var cxt=c.getContext("2d");
  var tot = img.length;
  var k = 2;
  var hor = 50;
  var step = 1;
  var text_pos = -1;
  for (var l = 0; l < Math.log(tot)/Math.LN2; l++) {
    var tot = img.length;
    var bgn = 30;
    for (var i = 0; i < tot; i++) {
      var height = img[i].height * interval /img[i].width;
      cxt.drawImage(img[i], bgn, hor - height, interval, height);
      var j = 2;
      if ((i+1)%k != 0 && i < tot - 1)
        j = 1;
      bgn += j * interval;
    }
    if (text_pos == -1)
      text_pos = bgn;
    cxt.font="20px Arial";
    cxt.fillText("Step " + step, text_pos, hor);
    var pos = interval;
    /*
       for (var j = 0; j < tot - 1; j++) {
       if ((j+1) % k != 0) {
       cxt.fillStyle="#000000";
       cxt.fillRect(pos, hor - 8, interval, 2);
       }
       pos += interval * 2;
       }
       */
    k *= 2;
    hor += horizon;
    step++;
  }
}
