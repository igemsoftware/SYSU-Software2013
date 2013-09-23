/**
 *
 *    File:         regulation.js
 *    Author:       Rathinho
 *    Description:  Main entrance of this application, including initialization of graphiti
 *                  application, configuration window and websocket.
 *
 **/

// document ready

// a_why_begin 

var genecircuitData = 
{"proteins": {1: {"RiPS": 11.49, "name": "BBa_C0060", "before_regulated": 12581.55, "concen": 0.1, "grp_id": 4, "pos": 2, "PoPS": 15.0, "repress_rate": 0.0, "K1": null, "induce_rate": -1, "copy": 73.0, "display": "True"}, 2: {"RiPS": 11.49, "name": "BBa_C0060", "before_regulated": 12581.55, "concen": 0.1, "grp_id": 4, "pos": 4, "PoPS": 15.0, "repress_rate": 0.0, "K1": null, "induce_rate": -1, "copy": 73.0, "display": "True"}, 3: {"RiPS": 11.49, "name": "BBa_K518003", "before_regulated": 12581.55, "concen": 0.1, "grp_id": 4, "pos": 6, "PoPS": 15.0, "repress_rate": 0.0, "K1": null, "induce_rate": -1, "copy": 73.0, "display": "False"}, 4: {"RiPS": 11.49, "name": "BBa_K142002", "before_regulated": 12581.55, "concen": 0.1, "grp_id": 4, "pos": 8, "PoPS": 15.0, "repress_rate": 0.0, "K1": null, "induce_rate": -1, "copy": 73.0, "display": "False"}, 5: {"RiPS": 11.49, "name": "BBa_C0160", "before_regulated": 28711.097099999995, "concen": 0.1, "grp_id": 5, "pos": 2, "PoPS": 34.23, "repress_rate": 0.4428135474975083, "K1": -2.4287510356503725, "induce_rate": -1, "copy": 73.0, "display": "True"}, 6: {"RiPS": 11.49, "name": "BBa_C0178", "before_regulated": 79590.88530000001, "concen": 0.1, "grp_id": 7, "pos": 2, "PoPS": 94.89, "repress_rate": -0.44281354749750546, "K1": -2.451703061628793, "induce_rate": -1, "copy": 73.0, "display": "True"}, 7: {"RiPS": 11.49, "name": "BBa_C0178", "before_regulated": 79590.88530000001, "concen": 0.1, "grp_id": 7, "pos": 4, "PoPS": 94.89, "repress_rate": -0.44281354749750546, "K1": -2.451703061628793, "induce_rate": -1, "copy": 73.0, "display": "True"}}, "plasmids": [[4, 5, 7]], "groups": {4: {"from": -1, "state": "cis", "corep_ind_type": "null", "to": [5, 6], "sbol": [{"type": "Promoter", "name": "BBa_K418000"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0060", "id": 1}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0060", "id": 2}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Activator", "name": "BBa_K518003", "id": 3}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Repressor", "name": "BBa_K142002", "id": 4}, {"type": "Terminator", "name": "BBa_B0013"}], "type": "Constitutive"}, 5: {"from": 3, "state": "cis", "corep_ind_type": "Inducer", "to": [], "sbol": [{"type": "Promoter", "name": "BBa_I712074"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0160", "id": 5}, {"type": "Terminator", "name": "BBa_B0013"}], "corep_ind": "BBa_P0140", "type": "Positive"}, 7: {"from": 4, "state": "cis", "corep_ind_type": "Inducer", "to": [], "sbol": [{"type": "Promoter", "name": "BBa_I712074"}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0178", "id": 6}, {"type": "RBS", "name": "BBa_J61104"}, {"type": "Protein", "name": "BBa_C0178", "id": 7}, {"type": "Terminator", "name": "BBa_B0013"}], "corep_ind": "BBa_P0140", "type": "Negative"}}}

// var genecircuitData =  
// { 
    // // "detail": {  
        // // "type": "copy",  
        // // "pro_id": 1,  
        // // "new_value": 22.22,  
        // // "repressor_list": [  
            // //   
        // // ]  
    // // },  
    // // "gene_circuit": {  
        // 'proteins': { 
            // 1: { 
                // 'RiPS': 11.49, 
                // 'name': 'BBa_C0060', 
                // 'before_regulated': 20, 
                // 'concen': 7.95908853, 
                // 'grp_id': 2, 
                // 'PoPS': 94.89, 
                // 'repress_rate': 100, 
                // 'induce_rate': 30, 
                // 'copy': 73.0, 
								// 'K1': 3.2, 
            // }, 
            // 2: { 
                // 'RiPS': 11.49, 
                // 'name': 'BBa_K518003', 
                // 'before_regulated': 0, 
                // 'concen': 7.95908853, 
                // 'grp_id': 2, 
                // 'PoPS': 94.89, 
                // 'repress_rate': 100, 
                // 'induce_rate': 0, 
                // 'copy': 73.0, 
								// 'K1': 3.2, 
            // }, 
            // 3: { 
                // 'RiPS': 11.49, 
                // 'name': 'BBa_C0160', 
                // 'before_regulated': 0, 
                // 'concen': 383.20873499999993, 
                // 'grp_id': 3, 
                // 'PoPS': 55.55, 
                // 'repress_rate': 0.2998365890589771, 
                // 'induce_rate': 0, 
                // 'copy': 73.0, 
								// 'K1': 3.2, 
            // }, 
            // 4: { 
                // 'RiPS': 11.49, 
                // 'name': 'BBa_C0178', 
                // 'before_regulated': 0, 
                // 'concen': 383.20873499999993, 
                // 'grp_id': 4, 
                // 'PoPS': 55.55, 
                // 'repress_rate': 0.2998365890589771, 
                // 'induce_rate': 0, 
                // 'copy': 73.0, 
								// 'K1': 3.2, 
            // } 
        // }, 
        // 'plasmids': [ 
            // [ 
                // 2, 
                // 3, 
                // 4 
            // ] 
        // ], 
        // 'groups': { 
            // 2: { 
                // 'from': -1, 
                // 'sbol': [ 
                    // { 
                        // 'type': 'Regulatory', 
                        // 'name': 'BBa_I712074' 
                    // }, 
                    // { 
                        // 'type': 'RBS', 
                        // 'name': 'BBa_J61104' 
                    // }, 
                    // { 
                        // 'type': 'Coding', 
                        // 'name': 'BBa_C0060', 
                        // 'id': 1 
                    // }, 
                    // { 
                        // 'type': 'RBS', 
                        // 'name': 'BBa_J61104' 
                    // }, 
                    // { 
                        // 'type': 'Coding', 
                        // 'name': 'BBa_K518003', 
                        // 'id': 2 
                    // }, 
                    // { 
                        // 'type': 'Terminator', 
                        // 'name': 'BBa_B0013' 
                    // } 
                // ], 
                // 'type': 'Constitutive', 
                // 'state': 'cis', 
                // 'to': [ 
                    // 3, 
                    // 4 
                // ] 
            // }, 
            // 3: { 
                // 'from': 2, 
                // 'sbol': [ 
                    // { 
                        // 'type': 'Regulatory', 
                        // 'name': 'BBa_J64000' 
                    // }, 
                    // { 
                        // 'type': 'RBS', 
                        // 'name': 'BBa_J61104' 
                    // }, 
                    // { 
                        // 'type': 'Coding', 
                        // 'name': 'BBa_C0160', 
                        // 'id': 3 
                    // }, 
                    // { 
                        // 'type': 'Terminator', 
                        // 'name': 'BBa_B0013' 
                    // } 
                // ], 
                // 'type': 'Negative', 
                // 'state': 'cis', 
                // 'to': [ 
                    //  
                // ] 
            // }, 
            // 4: { 
                // 'from': 2, 
                // 'sbol': [ 
                    // { 
                        // 'type': 'Regulatory', 
                        // 'name': 'BBa_J64000' 
                    // }, 
                    // { 
                        // 'type': 'RBS', 
                        // 'name': 'BBa_J61104' 
                    // }, 
                    // { 
                        // 'type': 'Coding', 
                        // 'name': 'BBa_C0178', 
                        // 'id': 4 
                    // }, 
                    // { 
                        // 'type': 'Terminator', 
                        // 'name': 'BBa_B0013' 
                    // } 
                // ], 
                // 'type': 'Negative', 
                // 'state': 'cis', 
                // 'to': [ 
                    //  
                // ] 
            // } 
        // } 
    // // }  
// } 
// var genecircuitData = { 
	// proteins: [ 
		// { 
			// PoPS: 60, 
			// RiPS: 52, 
			// copy: 30, 
			// repress_rate: 15, 
			// induce_rate: 66, 
			// before_regulated: 53, 
			// after_regulated: 30, 
			// after_induced: 20, 
		// }, 
		// { 
			// PoPS: 6, 
			// RiPS: 50, 
			// copy: 71, 
			// repress_rate: 15, 
			// induce_rate: 66, 
			// before_regulated: 25, 
			// after_regulated: 53, 
			// after_induced: 20, 
		// }, 
		// { 
			// PoPS: 46, 
			// RiPS: 95, 
			// copy: 71, 
			// repress_rate: 45, 
			// induce_rate: 6, 
			// before_regulated: 51, 
			// after_regulated: 23, 
			// after_induced: 20, 
		// }, 
	// ], 
	// plasmids: [ 
		// [{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}], 
		// [{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}], 
	// ] 
// } 

var dataCollection = {
	// proteins: [], 
	// plamids: [], 
}
// a_why_end 

$().ready(function() {
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  // toggle left-container
  $(".trigger-left").click(function() {
    var left = $("#left-container").css("left");

    if (parseInt(left) == 0) {
      $("#left-container").css({
        left: '-270px'
      });
    } else {
      $("#left-container").css({
        left: '0px'
      });
    }
  });

  // toggle right-container
  $(".trigger-right").click(function() {
    var right = $("#right-container").css("right");

    if (parseInt(right) == 0) {
      $("#right-container").css({
        right: '-270px'
      });
    } else {
      $("#right-container").css({
        right: '0px'
      });
    }
  });

  $("#content").click(function() {
    $("#left-container").css({
      left: '-270px'
    });

    $("#right-container").css({
      right: '-270px'
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
        $("#user-view-left #username").text(message.result);
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
        console.log(message.result);
			} else if (message.request == "getGroup") {
				console.log("getGroup", message);
        if(message.result==='ERROR!'){
          ws.send(JSON.stringify({
            'request': 'getGroup',
            // 'data': regulationData, 
            'data': {"part": [{"type": "Protein", 
            "id": "1", "name": "BBa_C0060"}, 
            {"type": "Protein", "id": "2", "name": "BBa_C0060"}, 
            {"type": "Activator", "id": "3", "name": "Activator"}, 
            {"type": "Repressor", "id": "4", "name": "Repressor"}, 
            {"type": "Protein", "id": "5", "name": "BBa_C0160"}, 
            {"type": "Protein", "id": "6", "name": "BBa_C0178"}, 
            {"type": "Protein", "id": "7", "name": "BBa_C0178"}], 
            "link": [{"to": "2", "from": "1", "type": "Bound"}, 
            {"to": "3", "from": "2", "type": "Bound"}, 
            {"to": "4", "from": "3", "type": "Bound"},
            {"to": "5", "from": "3", "inducer": "None", "type": "Activator"}, 
            {"to": "6", "from": "4", "inducer": "Positive", "type": "Repressor"}, 
            {"to": "7", "from": "6", "type": "Bound"}]},
          }));
          return;
        }else{
          genecircuitData = message.result;
        }
				ws.send(JSON.stringify({'request'     : 'Simulate',
										'isStochastic': false,
										'gene_circuit':JSON.stringify(genecircuitData),
										'corepind':{},
				}));
				init(genecircuitData);
			} else if (message.request == "Simulate") {
        var raw_data = message.result.data;
        var data = turnRawDatatoData(raw_data);
        var time = message.result.time;
        var dt = message.result.dt;
	      $("#canvasDiv div").css("margin", "auto");
        run(data,'canvasDiv', 300, 200, time, dt * 4);
      } else if (message.request == "changeRBS") {
				/* console.log(message.result); */
				console.log("changeRBS", message);
				// console.log(genecircuitData); 
				init(genecircuitData);   
			} else if (message.request == "getPlasmidSbol") {
				console.log("getPlasmidSbol", message);
			} else if (message.request == "loadSBOL") {
				console.log("loadSBOL", message);
			} else if (message.request == "updateGeneCircuit") {
				console.log("kakakakakakka");
         console.log("updateGeneCircuit", message.result); 
				genecircuitData = message.result;
				updateGen(genecircuitData);
				ws.send(JSON.stringify({'request'     : 'Simulate',
										'isStochastic': false,
										'gene_circuit':JSON.stringify(genecircuitData),
										'corepind':{},
				}));
			} else if (message.request == "getIndexSave") {
				console.log("getIndexSave", message.result); 
				genecircuitData = message.result;
			} else if (message.request == "getBiobrickPath") {
				ws.send(JSON.stringify({ 
					'request': 'getXmlJson', 
					'path': message.result.replace(/\\/g, "/"),
				})); 

				$("#right-container").css({right: '0px'});
				var hasClassIn = $("#collapseTwo").hasClass('in');
				if(!hasClassIn) {
					$("#collapseOne").toggleClass('in');
					$("#collapseOne").css({height: '0'});
					$("#collapseTwo").toggleClass('in');
					$("#collapseTwo").css({height: "auto"});
				}	
				$("#exogenous-factors-config").css({"display": "none"});
						$("#protein-config").css({"display": "none"});
						$("#component-config").css({"display": "block"});
						$("#arrow-config").css({"display": "none"});

				console.log("getBiobrickPath", message.result); 
      }
    };
  }



  /*
   *  Websocket onopen
   */
  ws.onopen = function() {
    // get directory
    // ws.send(JSON.stringify({ 
      // 'request': 'getDirList', 
      // 'dir': 'web\\biobrick\\Protein coding sequences' 
    // })); 
		
    // get username
    ws.send(JSON.stringify({
      'request': 'getLoginedUserName'
    }));

		// ws.send(JSON.stringify({  
			// 'request': 'getIndexSave',  
		// }));
    //var regulationData = sessionStorage.regulation;
    var regulationData = { 
      "part": [ 
			{ "id"  : "1", 
				"name": "BBa_C0060", 
				"type": "Protein" 
      }, 
      { "id"  : "2", 
        "name": "BBa_C0060", 
        "type": "Protein" 
      }, 
      { "id"  : "3", 
        "name": "Activator", 
        "type": "Activator" 
      }, 
      { "id"  : "4", 
        "name": "Repressor", 
        "type": "Repressor" 
      }, 
      { "id"  : "5", 
        "name": "BBa_C0160", 
        "type": "Protein" 
      }, 
      { "id"  : "6", 
        "name": "BBa_C0178", 
        "type": "Protein" 
      }, 
      { "id"  : "7", 
        "name": "BBa_C0178", 
        "type": "Protein" 
      } 
 
      ], 
      "link": [ 
        { "from": "1", 
          "to"  : "2", 
          "type": "Bound", 
      }, 
      { "from": "2", 
        "to"  : "3", 
        "type": "Bound", 
      }, 
      { "from": "3", 
        "to"  : "4", 
        "type": "Bound", 
      }, 
      { "from": "3", 
        "to"  : "5", 
        "type": "Activator", 
        "inducer": "None" 
      }, 
      { "from": "4", 
        "to"  : "6", 
        "type": "Repressor", 
        "inducer": "Positive" 
        }, 
      { "from": "6", 
        "to"  : "7", 
        "type": "Bound", 
        }, 
 
      ] 
		}; 
     // console.log(regulationData); 
		 
		if(sessionStorage.regulation) {
			ws.send(JSON.stringify({
				'request': 'getGroup',
				// 'data': regulationData, 
				'data': eval('(' + sessionStorage.regulation + ')'),
			}));
		} else {
			ws.send(JSON.stringify({
				'request': 'getGroup',
				'data': regulationData, 
				// 'data': eval('(' + sessionStorage.regulation + ')'), 
			}));
		
		}

		//ws.send(JSON.stringify({     
			//'request': 'changeRBS',     
		//}));     
		// console.log('sessionStorage', sessionStorage); 

		// ws.send(JSON.stringify({ 
			// 'request': 'getIndexSave', 
		// })); 

		// ws.send(JSON.stringify({ 
			// 'request': 'updateGeneCircuit', 
		// })); 
//  
		// ws.send(JSON.stringify({ 
			// 'request': 'getGroup', 
		// })); 
//  
		// ws.send(JSON.stringify({ 
			// 'request': 'getPlasmidSbol', 
		// })); 
//  
//  
		// ws.send(JSON.stringify({ 
			// 'request': 'loadSBOL', 
		// })); 


  }

  // Cleanly close websocket when unload window
  window.onbeforeunload = function() {
    ws.onclose = function() {}; // disable onclose handler first
    ws.close();
  };

	// a_why_begin 
  $('#cmd_undo').click(function(ev) {
    /* app.undo(); */
		historyStack.undo();
  });

  $('#cmd_redo').click(function(ev) {
    historyStack.redo();
  });

	console.log("aa", sessionStorage);

	// a_why_end 


  // // Create graphiti application 
  // app = new g.Application(); 
//  
  // $('#cmd_undo').click(function(ev) { 
    // app.undo(); 
  // }); 
//  
  // $('#cmd_redo').click(function(ev) { 
    // app.redo(); 
  // }); 
//  
  // $('#cmd_zoom_in').click(function(ev) { 
    // app.zoom(ev.clientX, ev.clientY, 0.9); 
  // }); 
//  
  // $('#cmd_zoom_out').click(function(ev) { 
    // app.zoom(ev.clientX, ev.clientY, 1.1); 
  // }); 
//  
  // $('#cmd_zoom_reset').click(function(ev) { 
    // app.zoomReset(); 
  // }); 
//  
  // $('#cmd_snap_to_grid').click(function(ev) { 
    // app.toggleSnapToGrid(); 
  // }); 
});
