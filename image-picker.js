// File Name: image-picker.js

// Gallery se image ke liye
function setupImagePicker(inputId, previewId, hiddenInputId) {
    document.getElementById(inputId).onchange = function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(previewId).src = e.target.result;
                document.getElementById(previewId).style.display = 'block';
                document.getElementById(hiddenInputId).value = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }
}

// URL se image ke liye
function setupUrlPicker(urlInputId, previewId, hiddenInputId) {
    document.getElementById(urlInputId).oninput = function() {
        const url = this.value;
        if (url) {
            document.getElementById(previewId).src = url;
            document.getElementById(previewId).style.display = 'block';
            document.getElementById(hiddenInputId).value = url;
        } else {
            document.getElementById(previewId).style.display = 'none';
            document.getElementById(hiddenInputId).value = '';
        }
    }
}

// Radio button toggle ke liye
function togglePicker(method, galleryDivId, urlDivId, previewId, hiddenInputId) {
    if (method === 'gallery') {
        document.getElementById(galleryDivId).style.display = 'block';
        document.getElementById(urlDivId).style.display = 'none';
    } else {
        document.getElementById(galleryDivId).style.display = 'none';
        document.getElementById(urlDivId).style.display = 'block';
    }
    document.getElementById(previewId).style.display = 'none';
    document.getElementById(hiddenInputId).value = '';
}

// Customer ke liye 1-line auto setup
function customerPhotoPicker(hiddenInputId, containerId) {
  const html = `
    <div>
      <input type="file" id="${containerId}_file" accept="image/*" style="display:none">
      <button type="button" onclick="document.getElementById('${containerId}_file').click()" style="padding: 8px 16px; background: #e40046; color: white; border: none; border-radius: 4px; cursor: pointer;">
        📷 Gallery से Photo चुने
      </button>
      <br><br>
      <img id="${containerId}_preview" src="" style="max-width: 200px; display:none; border: 1px solid #ddd; padding: 5px;">
      <input type="hidden" id="${hiddenInputId}">
    </div>
  `;
  document.getElementById(containerId).innerHTML = html;
  setupImagePicker(`${containerId}_file`, `${containerId}_preview`, hiddenInputId);
}