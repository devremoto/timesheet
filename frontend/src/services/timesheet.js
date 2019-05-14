import axios from 'axios';

export default class TimeSheetService {
    baseUrl = 'http://localhost:5001';

    getByMonth(month) {
        return new Promise((resolve, reject) => {
            axios.get(`${this.baseUrl}/timesheets`)
                .then(
                    result => resolve(result.data),
                    error => reject(error)
                ).catch(error => reject(error))
        })
    }

    setHour(user, month) {
        return new Promise((resolve, reject) => {
            axios.path(`${this.baseUrl}/timesheets`, { user, month })
                .then(
                    result => resolve(result.data),
                    error => reject(error)
                ).catch(error => reject(error))
        })
    }
}