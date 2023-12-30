// chat counts show

function initModal() {
    const modal = document.getElementById("dataShowModal")
    if (modal != null) {
        return
    }

    const style = document.createElement('style')
    style.textContent = modalCSS
    document.head.appendChild(style)

    const dataModal = document.createElement('div')
    dataModal.id = 'dataModalDiv'
    dataModal.innerHTML = `<div class="modal fade" id="dataShowModal" tabindex="-1" aria-labelledby="dataShowModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <select class="form-select-month" id="monthSelect">
            </select>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
          <canvas id="myChart" width="600" height="400"></canvas>
          </div>
      </div>
    </div>`

    document.body.appendChild(dataModal)
}

function initSentCounts() {
    const date = new Date()
    const month = date.getMonth()
    const day = date.getDate()

    let counts = 0
    const chatCounts = localStorage.getItem('chatSentCounts')
    if (chatCounts == null) {
        let data = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
            11: []
        };

        for (let i = 0; i < day; i++) {
            data[month].push(0)
        }
        localStorage.setItem('chatSentCounts', JSON.stringify(data))
    } else {
        let data = JSON.parse(chatCounts)
        if (day <= data[month].length) {
            return
        }
        for (let i = data[month].length; i < day; i++) {
            data[month].push(0)
        }
        localStorage.setItem('chatSentCounts', JSON.stringify(data))
    }
}

function updateSentCounts() {
    const chatCounts = localStorage.getItem('chatSentCounts')
    const date = new Date()
    const month = date.getMonth()
    const day = date.getDate()

    let data = JSON.parse(chatCounts)
    data[month][day - 1] += 1
    localStorage.setItem('chatSentCounts', JSON.stringify(data))
}

function showModalChart() {
    const sent = document.getElementById('sentCount')
    if (sent == null) {
        return
    }

    sent.addEventListener('click', function() {
        insertMonthtoSelect()

        const show = document.getElementById('dataShowModal')
        if (show != null) {
            show.style.position = 'absolute'
            show.style.width = '610px'
            show.style.height = '480px'
            show.style.left = '30%'
            show.style.top = '10%'
        }

        const myModal = new bootstrap.Modal(document.getElementById('dataShowModal'))
        myModal.show()

        // The current month is displayed initially
        const month = new Date().getMonth()
        modalChart(month)
        // Use a select to display data for different months.
        selectMonth()
    });
}

function selectMonth() {
    document.getElementById("monthSelect").addEventListener('change', function() {
        const selectElement = document.getElementById('monthSelect')
        const month = selectElement.value
        modalChart(month)
    })
}

function modalChart(month) {
    const ctx = document.getElementById('myChart')
    const existingChart = Chart.getChart(ctx)
    if (existingChart) {
        existingChart.destroy()
    }

    const date = new Date()
    const accessData = JSON.parse(localStorage.getItem('chatSentCounts'))[month]
    month = Number(month)
    const dataLabels = Array.from({
        length: date.getDate()
    }, (_,i)=>`${month + 1}-${i + 1}`)

    const myChart = new Chart(ctx,{
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                label: 'Total Messages sent',
                data: accessData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', 
                pointBorderColor: '#fff', 
                pointBorderWidth: 2, 
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'rgba(0, 0, 0, 0.8)',
                        boxWidth: 15,
                    },
                },
            },
        }
    });
}

function insertMonthtoSelect() {
    const selectElement = document.getElementById('monthSelect')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chatCounts = localStorage.getItem('chatSentCounts')
    if (chatCounts == null) {
        return
    }
    const datas = JSON.parse(chatCounts)
    const keys = Object.keys(datas)
    for (let i = keys.length - 1; i >= 0; i--) {
        if (selectElement.textContent.indexOf(months[i]) != -1) {
            continue
        }

        if (datas[`${i}`].length > 0) {
            const option = document.createElement('option')
            option.value = String(i)
            option.textContent = months[i]
            selectElement.appendChild(option)
        }
    }
}
