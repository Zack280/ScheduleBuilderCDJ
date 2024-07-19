// Function to add an activity to the schedule
function addActivity() {
    // Get form values
    const week = document.getElementById('week').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const activity = document.getElementById('activity').value;

    // Create a new row in the schedule table
    const table = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Insert cells and add values
    const dayCell = newRow.insertCell(0);
    const timeCell = newRow.insertCell(1);
    const activityCell = newRow.insertCell(2);
    dayCell.textContent = day;
    timeCell.textContent = time;
    activityCell.textContent = activity;

    // Clear the form
    document.getElementById('create-schedule').reset();
}


// Function to download the schedule as a PDF
function downloadPDF() {
    const pdfContent = document.getElementById('pdfContent');

    // Get the input fields and their values
    const weekInput = document.getElementById('weekInput');
    const groupInput = document.getElementById('groupInput');
    const weekText = weekInput ? weekInput.value : '';
    const groupText = groupInput ? groupInput.value : '';

    // Hide file inputs and buttons
    const fileInputs = pdfContent.querySelectorAll('input[type="file"]');
    const buttons = pdfContent.querySelectorAll('button');
    fileInputs.forEach(input => input.style.display = 'none');
    buttons.forEach(button => button.style.display = 'none');

    // Replace input fields with their values and style as bold
    const textInputs = pdfContent.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        const value = input.value;
        const span = document.createElement('span');
        span.textContent = value;
        span.style.display = 'none';
        span.style.padding = '2px 4px';
        span.style.margin = '2px';
        span.style.border = 'none'; // Remove border
        span.style.backgroundColor = 'transparent'; // Ensure background is transparent
        span.style.color = 'black'; // Ensure text color is appropriate
        span.style.fontWeight = 'bold'; // Make text bold
        span.style.textAlign = 'center'; // Center the text
        input.parentNode.replaceChild(span, input);
    });

    // Update the week and group text
    const weekTextSpan = document.getElementById('weekText');
    const groupTextSpan = document.getElementById('groupText');
    if (weekTextSpan) {
        weekTextSpan.textContent = weekText;
        weekTextSpan.style.display = 'inline'; // Inline to appear next to the text
        weekTextSpan.style.fontWeight = 'bold'; // Make text bold
        weekTextSpan.style.textAlign = 'center'; // Center the text
        weekTextSpan.style.marginLeft = '10px'; // Add margin for spacing
    }
    if (groupTextSpan) {
        groupTextSpan.textContent = groupText;
        groupTextSpan.style.display = 'inline'; // Inline to appear next to the text
        groupTextSpan.style.fontWeight = 'bold'; // Make text bold
        groupTextSpan.style.textAlign = 'center'; // Center the text
        groupTextSpan.style.marginLeft = '10px'; // Add margin for spacing
    }

    html2canvas(pdfContent, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 190; // Set width to 190mm
        const pdfWidth = pdf.internal.pageSize.getWidth();
        let imgHeight = canvas.height * imgWidth / canvas.width;

        // Adjust height if it exceeds the page height
        const pdfHeight = pdf.internal.pageSize.getHeight();
        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = canvas.width * imgHeight / canvas.height;
        }

        // Add the image to the PDF and save it
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // 10mm margin on the left and top
        pdf.save('weekly_schedule.pdf');
        
        // Show file inputs and buttons again
        fileInputs.forEach(input => input.style.display = 'block');
        buttons.forEach(button => button.style.display = 'inline-block');
        
        // Restore text inputs
        textInputs.forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.style.display = 'inline-block';
            input.style.margin = '0';
            span.parentNode.replaceChild(input, span);
        });

        // Restore the input fields for week and group
        if (weekInput) {
            weekInput.value = weekText;
        }
        if (groupInput) {
            groupInput.value = groupText;
        }

    }).catch(error => {
        console.error('Error generating PDF:', error);
        
        // Ensure elements are shown again if there was an error
        fileInputs.forEach(input => input.style.display = 'block');
        buttons.forEach(button => button.style.display = 'inline-block');
        
        // Restore text inputs in case of an error
        textInputs.forEach(span => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.style.display = 'inline-block';
            input.style.margin = '0';
            span.parentNode.replaceChild(input, span);
        });
        
        // Restore the input fields for week and group
        if (weekInput) {
            weekInput.value = weekText;
        }
        if (groupInput) {
            groupInput.value = groupText;
        }
    });
}



// Function to preview the selected image
function previewImage(event, previewId) {
    const input = event.target;
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            preview.style.maxWidth = '100%';
            preview.style.maxHeight = '100px';
            preview.style.margin = 'auto';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Event listener for the "Download PDF" button
document.getElementById('downloadPdf').addEventListener('click', downloadPDF);
