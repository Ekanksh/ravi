/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Invoice_numberentifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class TestCCNodeJS extends Contract {

    async InitLedger(ctx) {
        const DashBoards = [
            {
                invoice_number: '123',
                generated_Date: '17 Apr',
                contractor_Name: 'ravi',
                start_Date: '1 Sep',
                end_Date: '30 Sep',
                vendor_Name: 'raj',
                rate: '45',
                total_Hours_Billed: '30',
                approved_Amount: '3045',
                skills: 'engineering',
                role: 'developer',
                experience: '4',
                location: 'indore',
            },


        ];

        for (const DashBoard of DashBoards) {
           // DashBoard.docType = 'DashBoard';
            await ctx.stub.putState(DashBoard.invoice_number, Buffer.from(JSON.stringify(DashBoard)));
            console.info(`DashBoard ${DashBoard.invoice_number} initialized`);
        }
    }

    // CreateDashBoard : add a new DashBoard in an organization.
    async CreateDashBoard(ctx, invoice_number, generated_Date, contractor_Name, start_Date, end_Date, vendor_Name, rate, total_Hours_Billed, 
        approved_Amount,
        skills, role,experience, location) {
        const DashBoard = {
            Invoice_number: invoice_number,
            Generated_Date: generated_Date,
            Contractor_Name: contractor_Name,
            Start_Date: start_Date,
            End_Date: end_Date,
            Vendor_Name: vendor_Name,
            Rate: rate,
            Total_Hours_Billed: total_Hours_Billed,
            Approved_Amount: approved_Amount,
            Skills: skills,
            Role: role,
            experience:experience,
            Location: location,
        };
        ctx.stub.putState(invoice_number, Buffer.from(JSON.stringify(DashBoard)));
        return JSON.stringify(DashBoard);
    }

    // Fetch Info of an  indivInvoice_numberual DashBoard with empInvoice_number.
    async DashBoardDetails(ctx, invoice_number) {
        const empJSON = await ctx.stub.getState(invoice_number); // get the asset from chaincode state
        if (!empJSON || empJSON.length === 0) {
            throw new Error(`The DashBoard ${invoice_number} does not exist`);
        }
        return empJSON.toString();
    }

    // // Update DashBoard Records - Name / Designation CHange .
    async UpdateDashBoardInfo(ctx,  invoice_number, generated_Date, contractor_Name, start_Date, end_Date, vendor_Name, rate, total_Hours_Billed, 
        approved_Amount,
        skills, role,experience, location) {
        const exists = await this.DashBoardExists(ctx, invoice_number);
        if (!exists) {
            throw new Error(`The DashBoard ${invoice_number} does not exist`);
        }

        //     // overwriting info
        const updatedInfo = {
            Invoice_number: invoice_number,
            Generated_Date: generated_Date,
            Contractor_Name: contractor_Name,
            Start_Date: start_Date,
            End_Date: end_Date,
            Vendor_Name: vendor_Name,
            Rate: rate,
            Total_Hours_Billed: total_Hours_Billed,
            Approved_Amount: approved_Amount,
            Skills: skills,
            Role: role,
            Experience:experience,
            Location: location,

        };
        return ctx.stub.putState(invoice_number, Buffer.from(JSON.stringify(updatedInfo)));
    }

    // // DeleteDashBoard
    async DeleteDashBoard(ctx, invoice_number) {
        const exists = await this.DashBoardExists(ctx, invoice_number);
        if (!exists) {
            throw new Error(`The DashBoard ${invoice_number} does not exist`);
        }
        return ctx.stub.deleteState(invoice_number);
    }
    // // DashBoardExists returns true when asset with given Invoice_number exists in world state.
    async DashBoardExists(ctx, invoice_number) {
        const DashBoardJSON = await ctx.stub.getState(invoice_number);
        return DashBoardJSON && DashBoardJSON.length > 0;
    }

    // GetAllDashBoardDetails returns all records of DashBoards found in the world state.
    async GetAllDashBoardDetails(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all DashBoards in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = TestCCNodeJS;








