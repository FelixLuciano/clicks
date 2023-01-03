const clickSpeedTest = () => {
    return {
        clicks: 0,
        startTime: 0,
        endTime: 0,
        activeTime: 0,
        cps: 0,
        instantCps: 0,
        cpsMax: 0,
        storeTimeout: null,

        get time() {
            return new Date().getTime()
        },

        get idleTime() {
            return this.time - this.endTime
        },

        get activeTimeDisplay() {
            return getDisplay(this.activeTime / 1000, 1, 's')
        },

        get cpsDisplay() {
            return getDisplay(this.cps)
        },

        get instantCpsDisplay() {
            return getDisplay(this.instantCps)
        },

        get cpsMaxDisplay() {
            return getDisplay(this.cpsMax, 4)
        },

        restart() {
            this.clicks = this.cps = this.instantCps = this.cpsMax = 0
            this.startTime = this.time
        },

        mouseDown() {
            this.activeTime = this.time - this.startTime
            this.clicks++

            if (this.idleTime > 1000)
                this.restart()

            if (this.activeTime > 100) {
                this.instantCps = 1000 / (this.time - this.endTime)
                this.cps = this.clicks / this.activeTime * 1000
            }

            if (this.activeTime > 1000)
                this.cpsMax = Math.max(this.cps, this.cpsMax)
        },

        mouseUp() {
            this.endTime = this.time

            if (this.cpsMax > 0) {
                clearTimeout(this.storeTimeout)

                this.storeTimeout = setTimeout(() => this.store(), 1200)
            }
        },

        store() {
            this.$dispatch('store', {
                value: this.cpsMax
            })
        },
    }
}

const history = () => {
    const STORAGE_KEY = "com.lucianofelix.clickspeedtest"

    return {
        history: [],

        get serializedHistory() {
            return JSON.stringify(this.history.slice(0, 20))
        },

        insert(value) {
            let index

            for (index = 0; index < this.history.length; index++)
                if (value > this.history[index])
                    break

                this.history.splice(index, 0, value)
        },

        fetch() {
            const storageData = localStorage.getItem(STORAGE_KEY)

            if (storageData != null)
                this.history = JSON.parse(storageData)
            else
                this.commit()
        },

        commit() {
            const a = this.serializedHistory
            localStorage.setItem(STORAGE_KEY, a)
        },

        store(event) {
            this.insert(event.detail.value)
            this.commit()
        },
    }
}


function getDisplay(num, fix = 2, unit = '') {
    const [intVal, floatVal] = num.toFixed(fix).split('.')

    return `<span class="value__int">${intVal}</span><span class="value__float">.${floatVal}</span><span class="value__unit"> ${unit}</span>`
}
