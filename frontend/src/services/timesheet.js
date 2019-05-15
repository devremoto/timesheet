import axios from 'axios';

export default class TimeSheetService {
    baseUrl = 'http://localhost:5001';

    getByMonth(month) {
        return new Promise((resolve, reject) => {
            axios.get(`${this.baseUrl}/timesheets/${month}`)
                .then(
                    result => resolve(result.data),
                    error => reject(error)
                ).catch(error => reject(error))
        })
    }

    setHour(month) {
        return new Promise((resolve, reject) => {
            axios.put(`${this.baseUrl}/timesheets`, month )
                .then(
                    result => resolve(result.data),
                    error => reject(error)
                ).catch(error => reject(error))
        })
    }
}