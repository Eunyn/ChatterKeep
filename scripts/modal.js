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
    const chatCounts = localStorage.getItem('chatSentCounts')
    let datas = chatCounts != null ? JSON.parse(chatCounts) : {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: []};

    const month = new Date().getMonth()
    const day = new Date().getDate()
    const len = datas[month].length
    for (let i = len; i < day; i++) {
        datas[month].push(0)
    }
    localStorage.setItem('chatSentCounts', JSON.stringify(datas))
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

    const accessData = JSON.parse(localStorage.getItem('chatSentCounts'))[month]
    month = Number(month)
    const dayLen = getMonthDays()[month]
    const dataLabels = Array.from({
        length: dayLen
    }, (_,i)=>`${month + 1}-${i + 1}`)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const valid = validMonthData(accessData)
    if (!valid) {
        alert(`${months[month]} contains invalid data.`)
    }

    const myChart = new Chart(ctx,{
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                label: `Messages sent in ${months[month]}`,
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

    const month = new Date().getMonth()
    // Initially, insert current month
    if (!selectElement.textContent.includes(months[month])) {
        const option = document.createElement('option')
        option.value = String(month)
        option.textContent = months[month]
        selectElement.appendChild(option)
    }

    // insert other months if the data is not null
    for (let i = keys.length - 1; i >= 0; i--) {
        if (selectElement.textContent.includes(months[i]) || i === month) {
            continue
        }

        let flag = false
        for (let j = 0; j < datas[`${i}`].length; j++) {
            if (datas[`${i}`][j] > 0) {
                flag = true
                break
            }
        }
        if (flag) {
            const option = document.createElement('option')
            option.value = String(i)
            option.textContent = months[i]
            selectElement.appendChild(option)
        }
    }
}


function isLeapYear(year) {
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
}

function getMonthDaysWithYear(year, month) {
    switch (month) {
    case 2:
        return isLeapYear(year) ? 29 : 28
    case 4:
    case 6:
    case 9:
    case 11:
        return 30
    default:
        return 31
    }
}

function getMonthDays() {
    const year = new Date().getFullYear()
    const monthWithDays = Array.from({length: 12}, (_, month) => getMonthDaysWithYear(year, month + 1))

    return monthWithDays
}

function validMonthData(accessData) {
    for (let i = 0; i < accessData.length; i++) {
        if (isNaN(accessData[i]) || accessData[i] < 0 || accessData >= 500) {
            return false;
        }
    }

    return true
}