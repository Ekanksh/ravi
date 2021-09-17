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
                Invoice_number: 123,
                Generated_Date: "17 Apr",
                Contractor_Name: "ravi",
                Start_Date: "1 Sep",
                End_Date: "30 Sep",
                Vendor_Name: "raj",
                Rate: 45,
                Total_Hours_Billed: 30,
                Approved_Amount: 3045,
                Skills: engineering,
                Role: developer,
                Experience: 4,
                Location: indore,
            },


        ];

        for (const DashBoard of DashBoards) {
            DashBoard.docType = 'DashBoard';
            await ctx.stub.putState(DashBoard.Invoice_number, Buffer.from(JSON.stringify(DashBoard)));
            console.info(`DashBoard ${DashBoard.Invoice_number} initialized`);
        }
    }

    // CreateDashBoard : add a new DashBoard in an organization.
    async CreateDashBoard(ctx, Invoice_number, Generated_Date, Contractor_Name, Start_Date, End_Date,Vendor_Name,
        Rate, Total_Hours_Billed, Approved_Amount, Skills, Role, Experience, Location ) {
        const DashBoard = {
            Invoice_number: Number,
            Generated_Date: String,
            Contractor_Name: String,
            Start_Date: String,
            End_Date: String,
            Vendor_Name: String,
            Rate: Number,
            Total_Hours_Billed: Number,
            Approved_Amount: Number,
            Skills: String,
            Role: String,
            Experience: Number,
            Location: String,
        };
        ctx.stub.putState(Invoice_number, Buffer.from(JSON.stringify(DashBoard)));
        return JSON.stringify(DashBoard);
    }

    // Fetch Info of an  indivInvoice_numberual DashBoard with empInvoice_number.
    async DashBoardDetails(ctx, Invoice_number) {
        const empJSON = await ctx.stub.getState(Invoice_number); // get the asset from chaincode state
        if (!empJSON || empJSON.length === 0) {
            throw new Error(`The DashBoard ${Invoice_number} does not exist`);
        }
        return empJSON.toString();
    }

    // Update DashBoard Records - Name / Designation CHange .
    async UpdateDashBoardInfo(ctx, Invoice_number, Generated_Date, Contractor_Name, Start_Date, End_Date,Vendor_Name,
        Rate, Total_Hours_Billed, Approved_Amount, Skills, Role, Experience, Location ) {
        const exists = await this.DashBoardExists(ctx, Invoice_number);
        if (!exists) {
            throw new Error(`The DashBoard ${Invoice_number} does not exist`);
        }

        // overwriting info
        const updatedInfo = {
            Invoice_number: Invoice_number,
            Generated_Date: String,
            Contractor_Name: String,
            Start_Date: String,
            End_Date: String,
            Vendor_Name: String,
            Rate: Number,
            Total_Hours_Billed: Number,
            Approved_Amount: Number,
            Skills: String,
            Role: String,
            Experience: Number,
            Location: String,
            
        };
        return ctx.stub.putState(Invoice_number, Buffer.from(JSON.stringify(updatedInfo)));
    }

    // DeleteDashBoard
    async DeleteDashBoard(ctx, Invoice_number) {
        const exists = await this.DashBoardExists(ctx, Invoice_number);
        if (!exists) {
            throw new Error(`The DashBoard ${Invoice_number} does not exist`);
        }
        return ctx.stub.deleteState(Invoice_number);
    }
    // DashBoardExists returns true when asset with given Invoice_number exists in world state.
    async DashBoardExists(ctx, Invoice_number) {
        const DashBoardJSON = await ctx.stub.getState(Invoice_number);
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



