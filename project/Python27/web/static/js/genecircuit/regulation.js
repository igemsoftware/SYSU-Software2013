/**
 *
 *    File:         regulation.js
 *    Author:       Rathinho
 *    Description:  Main entrance of this application, including initialization of graphiti
 *                  application, configuration window and websocket.
 *
 **/

// document ready

var genecircuitData = {
	proteins: [
		{
			PoPs: 60,
			RiPs: 52,
			copy: 30,
			repress_rate: 15,
			induce_rate: 66,
			before_regulated: 53,
			after_regulated: 30,
			after_induced: 20,
		},
		{
			PoPs: 6,
			RiPs: 50,
			copy: 71,
			repress_rate: 15,
			induce_rate: 66,
			before_regulated: 25,
			after_regulated: 53,
			after_induced: 20,
		},
		{
			PoPs: 46,
			RiPs: 95,
			copy: 71,
			repress_rate: 45,
			induce_rate: 6,
			before_regulated: 51,
			after_regulated: 23,
			after_induced: 20,
		},
	],
	plasmids: [
		[{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}],
		[{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}],
	]
}

var dataCollection = {
	proteins: [],
	plamids: [],
}

$().ready(function() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  // slide in right-container
  $("#right-container").mouseover(function() {
    $("#right-container").css({
      right: '0px'
    });
  });

  // slide out right-container
  $("#right-container").mouseout(function() {
    $("#right-container").css({
      right: '-261px'
    });
  });

  // logout
  $("#logout").click(function() {
    ws.send(JSON.stringify({
      'request': 'loginOut'
    }));
  });

  // load file list
  $("#myfile").click(function() {
    ws.send(JSON.stringify({
      'request': 'getUserFileList'
    }));
  });

  // save file
  $("#save").click(function() {
    var fnInput = $("#fn-input");
    var filename = fnInput.attr('value');
    if (!filename) {
      fnInput.focus();
      fnInput.tooltip('show');

      // check whether filename input has changed 
      var tid = setInterval(function() {
        filename = fnInput.attr('value');
        if (filename) {
          fnInput.tooltip('destroy');
          clearInterval(tid);
        }
      }, 1000);
    } else {

      // ws.send({
      //   "request" : "saveUserData",
      //   "data" : filename
      // });


      $("#myModalInfo").html("File: " + filename + " is saved!");
      $("#save-trigger").click();
    }
  });


  // protein configuration
  $("#protein-config").ready(function() {
    E.config({
      baseUrl: 'static/js/regulation/slider/js/'
    });

    E.use('slider', function() {
      // Slider 1
      //   var slider1 = new E.ui.Slider('#slider-1', {
      //     min: 0,
      //     max: 10,
      //     value: 5,
      //     axis: 'x',
      //     size: '198px'
      //   });

      //   var demoText1 = E('#slider-text-1');
      //   slider1.on('slide', function(e) {
      //     demoText1.text(this.value / 10);
      //   });

      //   demoText1.on('click', function() {
      //     slider1.setValue(5);
      //   });

      //   // Slider 2
      //   var slider2 = new E.ui.Slider('#slider-2', {
      //     min: -1,
      //     max: 10,
      //     value: 0,
      //     axis: 'x',
      //     size: '198px'
      //   });

      //   var demoText2 = E('#slider-text-2');
      //   slider2.on('slide', function(e) {
      //     demoText2.text(this.value);
      //   });

      //   demoText2.on('click', function() {
      //     slider2.setValue(0);
      //   });

      //   // Slider 3
      //   var slider3 = new E.ui.Slider('#slider-3', {
      //     min: -10,
      //     max: 10,
      //     value: 0.5,
      //     axis: 'x',
      //     size: '198px'
      //   });

      //   var demoText3 = E('#slider-text-3');
      //   slider3.on('slide', function(e) {
      //     demoText3.text(this.value);
      //   });

      //   demoText3.on('click', function() {
      //     slider3.setValue(0.5);
      //   });

      //   // Slider 4
      //   var slider4 = new E.ui.Slider('#slider-4', {
      //     min: -10,
      //     max: 10,
      //     value: 0,
      //     axis: 'x',
      //     size: '198px'
      //   });

      //   var demoText4 = E('#slider-text-4');
      //   slider4.on('slide', function(e) {
      //     demoText4.text(this.value);
      //   });

      //   demoText4.on('click', function() {
      //     slider4.setValue(0);
      //   });
    });

    $("#component-config").ready(function() {
      $("#component-form").mCustomScrollbar({
        autoHideScrollbar: true,
        theme: "dark-thin",
        advanced: {
          autoExpandVerticalScroll: true
        }
      });
    });
  });


  /*
   * Websocket onmessage
   */
  if ("WebSocket" in window) {
    ws = new WebSocket("ws://" + document.domain + ":5000/ws");
    ws.onmessage = function(msg) {
      var message = JSON.parse(msg.data);
      if (message.request == "getDirList") { // get directory
        if (message.result.files == 'true') {

        } else {
          if (proteinList.isInit) {
            proteinList.parseSubTree(message.result);
          } else {
            proteinList.parseJson(message.result.files);
          }
        }
      } else if (message.request == "getXmlJson") { // get configuration data of a single protein
        var part = eval('(' + message.result + ')').rsbpml.part_list.part;

        $("input[name=part_id]").attr({
          'value': part.part_id
        });
        $("input[name=part_name]").attr({
          'value': part.part_name
        });
        $("input[name=part_short_name]").attr({
          'value': part.part_short_name
        });
        $("input[name=part_short_desc]").attr({
          'value': part.part_short_desc
        });
        $("input[name=part_type]").attr({
          'value': part.part_type
        });
        $("input[name=part_status]").attr({
          'value': part.part_status
        });
        $("input[name=part_results]").attr({
          'value': part.part_results
        });
        $("input[name=part_nickname]").attr({
          'value': part.part_nickname
        });
        $("input[name=part_rating]").attr({
          'value': part.part_rating
        });
        $("input[name=part_author]").attr({
          'value': part.part_author
        });
        $("input[name=part_entered]").attr({
          'value': part.part_entered
        });
        $("input[name=part_quality]").attr({
          'value': part.best_quality
        });

      } else if (message.request == "getLoginedUserName") { // get username
        $("#user-view-left > p").text(message.result);
      } else if (message.request == "loginOut") { // get logout info
        window.location = "..";
      } else if (message.request == "getUserFileList") {
        console.log(message.result);
        $("#filelist").html("");
        for (var i = 0; i < message.result.length; i++) {
          $("#filelist").append("<a href=\"javascript:void(0);\" id=\"" + message.result[i].fileName + "\">" + message.result[i].fileName + "</a><br/>");
        };

        $("#filelist > a").live("click", function() {
          ws.send(JSON.stringify({
            "request": "loadUserFile",
            "fileName": "default1",
            "fileType": "data"
          }));
        });
      } else if (message.request == "loadUserFile") {
        console.log("loadUserFile", message.result);
      } else if (message.request == "changeRBS") {
				/* console.log(message.result); */
				console.log("changeRBS", message.result);
				// console.log(genecircuitData); 
				// init(genecircuitData); 
			} else if (message.request == "getGroup") {
				console.log("getGroup", message.result);
				// init(genecircuitData); 
			} else if (message.request == "getPlasmidSbol") {
				console.log("getPlasmidSbol", message);
			} else if (message.request == "loadSBOL") {
				console.log("loadSBOL", message);
			}
    };
  }



  /*
   *  Websocket onopen
   */
  ws.onopen = function() {
    // get directory
    ws.send(JSON.stringify({
      'request': 'getDirList',
      'dir': 'web\\biobrick'
    }));

    // get username
    ws.send(JSON.stringify({
      'request': 'getLoginedUserName'
    }));

		ws.send(JSON.stringify({
			'request': 'changeRBS',
		}));

		ws.send(JSON.stringify({
			'request': 'getGroup',
		}));

		ws.send(JSON.stringify({
			'request': 'getPlasmidSbol',
		}));

		ws.send(JSON.stringify({
			'request': 'loadSBOL',
		}));
  }

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function() {}; // disable onclose handler first
    ws.close();
  };



  // Create graphiti application
  /* app = new g.Application(); */
/*  */
  $('#cmd_undo').click(function(ev) {
    /* app.undo(); */
		historyStack.undo();
  });

  $('#cmd_redo').click(function(ev) {
    historyStack.redo();
  });

  /* $('#cmd_zoom_in').click(function(ev) { */
    /* app.zoom(ev.clientX, ev.clientY, 0.9); */
  /* }); */
/*  */
  /* $('#cmd_zoom_out').click(function(ev) { */
    /* app.zoom(ev.clientX, ev.clientY, 1.1); */
  /* }); */
/*  */
  /* $('#cmd_zoom_reset').click(function(ev) { */
    /* app.zoomReset(); */
  /* }); */
/*  */
  /* $('#cmd_snap_to_grid').click(function(ev) { */
    /* app.toggleSnapToGrid(); */
  /* }); */
});
