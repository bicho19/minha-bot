const axios = require("axios");
const https =  require('https');

const AnemClient = axios.create({
    baseURL: 'https://ac-controle.anem.dz/AllocationChomage/',
    timeout: 1000,
});

AnemClient.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

module.exports = {

    getPreInscriptionId: async (demandNumber, idNumber) => {
        try {
            const payload  = {
                'wassitNumber': demandNumber,
                'identityDocNumber': idNumber,
            };

            // Make the request
            const response = await AnemClient.get(
                "/api/validateCandidate/query",
                {
                    params: payload,
                });

            const data = response.data;

            if (!data.preInscriptionId || data.preInscriptionId?.length === 0){
                return null;
            }

            return data.preInscriptionId;

        } catch (exception) {
            console.log(exception);
            return null;
        }

    },

    getStructureId: async (preInscriptionId) => {
        try {
            const payload = {
                'Id': preInscriptionId,
            };

            // Make the request
            const response = await AnemClient.get(
                "/api/PreInscription/GetPreInscription",
                {
                    params: payload,
                });

            const data = response.data;

            if (!data.structureId || data.structureId?.length === 0) {
                return null;
            }

            return data.structureId;

        } catch (exception) {
            console.log(exception);
            return null;
        }
    },

    getRendezVousDates: async (preInscriptionId, structureId) => {
        try {
            const payload = {
                'StructureId': structureId,
                'PreInscriptionId': preInscriptionId,
            };

            // Make the request
            const response = await AnemClient.get(
                "/api/RendezVous/GetAvailableDates",
                {
                    params: payload,
                });

            const data = response.data;

            if (!data.dates || data.dates?.length === 0) {
                return null;
            }

            return data.dates;

        } catch (exception) {
            console.log(exception);
            return null;
        }
    },

}