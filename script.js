'use strict';

class App {
    #reports;
    tabs = document.querySelector('.dashboard__tabs');
    reportsContainer = document.querySelector('.dashboard__content');

    constructor() {
        this.reportsContainer.innerHTML = '';

        this._loadReport();
        this.tabs.addEventListener('click', this._changeReports.bind(this));
    };

    async _loadReport() {
        const res = await fetch('./data.json');
        this.#reports = await res.json();

        this.#reports.forEach((report, ind) => this._renderReport(report, 'weekly', 'Last Week', ind));
    };

    _renderReport(report, filter, prevText, ind) {
        const { title, timeframes } = report;
        const current = timeframes[filter].current;
        const previous = timeframes[filter].previous;

        const html = document.createElement('div');
        html.classList.add('dashboard__card');
        html.innerHTML = `
        <div class="dashboard__report">
            <div class="dashboard__report--head">
                <h2>${title}</h2>
                <button aria-label="Options"><span></span><span></span><span></span></button>
            </div>
            <div class="dashboard__report--body">
                <h3>${current}hrs</h3>
            </div>
            <div class="dashboard__report--footer">
                <p>${prevText} - ${previous}hrs</p>
            </div>
        </div>
        `;

        this.reportsContainer.insertAdjacentElement('beforeend', html);

        this._setBackground(html, title, ind);
    };

    _setBackground(html, title, ind) {
        const colors = ['#FF8B64', '#56C2E6', '#FF5E7D', '#4BCF83', '#7235D1', '#F1C75B'];
        const img = title.toLowerCase().split(' ').join('-');

        html.style.backgroundImage = `url(./images/icon-${img}.svg), linear-gradient(${colors[ind]} 80%, #fff0 20%)`;
    };

    _changeReports(e) {
        const prevTexts = {
            daily: 'Yesterday',
            weekly: 'Last Week',
            monthly: 'Last Month'
        };

        // Find clicked tab
        const tab = e.target.closest('.dashboard__tab');
        if (!tab) return;

        const filter = tab.dataset.tab;

        // Change active tab
        document.querySelectorAll('.dashboard__tab').forEach(tb => tb.classList.remove('active'));
        tab.classList.add('active');

        // Render report card
        this.reportsContainer.innerHTML = '';
        this.#reports.forEach((report, ind) => this._renderReport(report, filter, prevTexts[filter], ind));
    };
};

const app = new App();

