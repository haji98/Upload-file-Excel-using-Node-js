const rank = ['Excellent', 'Good', 'Average', 'Below'];

// Set Rank 
function setRank(average) {
    let rankInTable = null;

    if (average >= 8.5) {
        rankInTable = rank[0];
    } else if (average >= 7) {
        rankInTable = rank[1];

    } else if (average >= 5.5) {
        rankInTable = rank[2];
    } else {
        rankInTable = rank[3];
    }
    return rankInTable;
}

// Random image
function ImageRandom() {
    var description = [
        "https://media2.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
        "https://media3.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif",
        "https://media.tenor.com/images/bb33cc1eaafa266ac1092ecff7c1c85d/tenor.gif",
        "https://media1.giphy.com/media/CjmvTCZf2U3p09Cn0h/giphy.gif",
        "https://media3.giphy.com/media/dRcMsUUrnR8He/giphy.gif",
        "https://media0.giphy.com/media/SRO0ZwmImic0/giphy.gif",
        "https://media.giphy.com/media/fAT2Db0j0Mblu/giphy.gif",
        "https://media.giphy.com/media/WYEWpk4lRPDq0/giphy.gif"
    ];

    let size = description.length
    let x = Math.floor(size * Math.random())
    return description[x];
}

// Add data in table
function addData(name, math, physics, chemistry, average, rank) {
    $("#myTable")
        .append($('<tr>')
            .append($('<td>')
                .text(name)
            )
            .append($('<td>')
                .html('<img src="' + ImageRandom($("#image").attr('src')) + '"/>')
            )
            .append($('<td>')
                .text(math)
            )
            .append($('<td>')
                .text(physics)
            )
            .append($('<td>')
                .text(chemistry)
            )
            .append($('<td>')
                .text(average)
            )
            .append($('<td>')
                .text(rank)
            )
            .append($('<td>')
                .html('<button type = "button" class = "btn btn-danger btn-xs dt-delete" style="font-size: 5px;" onclick="btnDelete();">' +
                    '<span class = "glyphicon glyphicon-remove"aria - hidden = "true" > </span> </button> ')
            )
        );
}

// Upload Button
$('.upload-btn').on('click', function() {
    $('#upload').click();
})
$('#upload').on('change', function() {
    var files = $(this).get(0).files;
    var result = document.createElement('p');
    if (files[0].name.split('.')[files[0].name.split('.').length - 1] != 'xlsx') {
        $('#result').html('<span style = "color: red; font-weight: bold; ">The uploaded file must be a file containing the extension is .xlsx!</span>');
    } else {
        $('#result').html('Your file size is: ' + files[0].size / 1000 + ' kbytes(' + files[0].size + ' bytes)');
    }

})

// Delete buttons
function btnDelete() {
    $('.dt-delete').click(function() {
        $(this).parents('tr').first().remove();
    });
}

// Insert data to table
document.querySelector('#upload').addEventListener('change', function(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    let excelFile = e.target.files[0];
    formData.append("excel", excelFile);

    xhr.open("POST", '/upload');
    xhr.send(formData);
    xhr.onreadystatechange = (e) => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let studentArr = JSON.parse("[" + xhr.responseText + "]");
            if (studentArr.length > 0) {
                $("#myTable").show();
                for (let i = 1; i < studentArr[0].length; i++) {
                    let sv = studentArr[0][i];
                    let avg = ((sv[1] + sv[2] + sv[3]) / 3).toFixed(2);
                    let rank = setRank(avg);

                    sv.push(avg);
                    sv.push(rank);
                    addData(sv[0], sv[1], sv[2], sv[3], sv[4], sv[5]);
                }
            }
        }
    }
});