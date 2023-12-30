// modal CSS

const modalCSS = `
@charset "UTF-8";

.modal-open {
    overflow: hidden
}

.modal-open .modal {
    overflow-x: hidden;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    display: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: .5rem;
    pointer-events: none
}

.modal-dialog-scrollable .modal-content {
    max-height: 100%;
    overflow: hidden
}

.modal-dialog-scrollable .modal-body {
    overflow-y: auto
}

.modal-dialog-centered {
    display: flex;
    align-items: center;
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: .3rem;
    outline: 0
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000
}

.modal-backdrop.fade {
    opacity: 0
}

.modal-backdrop.show {
    opacity: .5
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
}

.modal-header .btn-close {
    padding: .5rem .5rem;
    margin: -.5rem -.5rem -.5rem auto
}

.modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem
}

.modal-fullscreen {
    width: 100vw;
    max-width: none;
    height: 100%;
    margin: 0
}

.modal-fullscreen .modal-content {
    height: 100%;
    border: 0;
    border-radius: 0
}

.modal-fullscreen .modal-header {
    border-radius: 0
}

.modal-fullscreen .modal-body {
    overflow-y: auto
}

.modal-fullscreen .modal-footer {
    border-radius: 0
}

.alert-dismissible .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    padding: 1.25rem 1rem
}

.btn-close {
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: .25em .25em;
    color: #000;
    background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
    border: 0;
    border-radius: .25rem;
    opacity: .5
}

.btn-close:hover {
    color: #000;
    text-decoration: none;
    opacity: .75
}

.btn-close:focus {
    outline: 0;
    box-shadow: 0 0 0 .25rem rgba(13, 110, 253, .25);
    opacity: 1
}

.btn-close {
    margin-right: -.375rem;
    margin-left: .75rem
}

.form-select-month {
    height: 45px;
    width: 100px;
    text-align: center;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    background-color: #fff;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-select-month option {
    padding: 12px;
    height: 15px;
    text-align: center;
}

.form-select-month:hover,
.form-select-month:focus {
    border-color: #6c757d;
    outline: none;
    box-shadow: 0 0 5px rgba(108, 117, 125, 0.5);
}

.form-select-month::after {
    content: '\\25BC'; /* Unicode character for down arrow */
    position: absolute;
    top: 50%;
    right: 10px;
    pointer-events: none; /* Make sure the arrow doesn't interfere with clicks on the select */
}

.form-select-month:hover,
.form-select-month:focus {
    background-color: #f8f9fa;
}

.form-select-month,
.form-select-month:focus {
    transition: all 0.3s;
}

.form-select-month:disabled,
.form-select-month[aria-disabled="true"] {
    background-color: #e9ecef;
    cursor: not-allowed;
}

`