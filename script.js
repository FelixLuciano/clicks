const clickSpeedTest = () => {
    const STORAGE_KEY = "com.lucianofelix.clickspeedtest"
    const storageData = localStorage.getItem(STORAGE_KEY)
    const history = (JSON.parse(storageData) || []).slice(0, 20)

    return {
        cps: 0,
        instantCps: 0,
        cpsMax: 0,
        clicks: 0,
        startTime: 0,
        endTime: 0,
        activeTime: 0,
        storeTimeout: null,
        history,

        get time() {
            return new Date().getTime()
        },

        get idleTime() {
            return this.time - this.endTime
        },

        get activeTimeDisplay() {
            return this.nornalize(this.activeTime / 1000, 1)
        },

        get cpsDisplay() {
            return this.nornalize(this.cps)
        },

        get instantCpsDisplay() {
            return this.nornalize(this.instantCps)
        },

        get cpsMaxDisplay() {
            return this.nornalize(this.cpsMax, 4)
        },

        get sortedHistory() {
            return this.history.sort((a, b) => b - a)
        },

        nornalize(num, fix = 2) {
            return num.toFixed(fix)
        },

        restart() {
            this.clicks = this.cps = this.cpsMax = 0
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
            clearTimeout(this.storeTimeout)

            this.endTime = this.time
            this.storeTimeout = setTimeout(() => this.store(), 1200)
        },

        store() {
            if (this.cpsMax > 0)
                this.history.push(this.cpsMax)

            const value = JSON.stringify(this.history)

            localStorage.setItem(STORAGE_KEY, value)
        },
    }
}
