$(function(){
	$('#calendar2').fullCalendar({ 
	});

		var data2 = [
		    {
		        value: 220,
		        color:"#A2D19E",
		        highlight: "rgba(162, 209, 158, 0.9)",
		        label: "Success"
		    },
		    {
		        value: 70,
		        color: "#D57D6D",
		        highlight: "rgba(213, 125, 109, 0.9)",
		        label: "Danger"
		    },
		    {
		        value: 100,
		        color: "#80B1CB",
		        highlight: "rgba(128, 177, 203, 0.9)",
		        label: "Info"
		    }
		]
		var cpie = document.getElementById("cpie").getContext("2d");
        new Chart(cpie).Pie(data2, {
            responsive: true
        });

        var chart2 = c3.generate({
	    bindto: '#piechart',
	    data: {
	         
	        // iris data from R
	        columns: [
	            ['data1', 10],
	            ['data2', 30],
	            ['data3', 5],
	            ['data4', 19],
	            
	        ],
	        type : 'pie',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    color: {
	        pattern: ['#06c5ac','#3faae3','#ee634c','#6bbd95','#9b59b6','#16a085','#c0392b']
	    }
	});

     $('.warning-growl').click(function(event) {
        return $.growl.warning({
        message: "Warning Notification"
      });
    });    
});
