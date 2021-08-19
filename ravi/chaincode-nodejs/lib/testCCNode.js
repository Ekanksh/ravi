/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class TestCCNodeJS extends Contract {

    async InitLedger(ctx) {
        const employees = [
            {
              id : '1',
              name : 'Navyateja',
              role : 'Sr. SE',
            },
            { 
              id : '2',
              name : 'Azhar',
              role : 'Jr. SE',
            },
            { 
              id : '3',
              name : 'Raviranjan',
              role : 'Jr. SE',
            },
            {
              id : '4',
              name : 'Sathwik',
              role : 'Jr. SE',
            },
        ];

        for (const employee of employees) {
            employee.docType = 'employee';
            await ctx.stub.putState(employee.id, Buffer.from(JSON.stringify(employee)));
            console.info(`Employee ${employee.id} initialized`);
        }
    }

    // CreateEmployee : add a new employee in an organization.
    async CreateEmployee(ctx, id, name, role) {
        const employee = {
            Id: id,
            Name: name,
            Role: role
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(employee)));
        return JSON.stringify(employee);
    }

    // Fetch Info of an  individual employee with empID.
    async empDetails(ctx, id) {
        const empJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!empJSON || empJSON.length === 0) {
            throw new Error(`The employee ${id} does not exist`);
        }
        return empJSON.toString();
    }

    // Update Employee Records - Name / Designation CHange .
    async UpdateEmpInfo(ctx, id, name, role) {
        const exists = await this.EmployeeExists(ctx, id);
        if (!exists) {
            throw new Error(`The employee ${id} does not exist`);
        }

        // overwriting info
        const updatedInfo = {
            ID: id,
            Name: name,
            Role: role,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedInfo)));
    }

    // DeleteEmployee
    async DeleteEmployee(ctx, id) {
        const exists = await this.EmployeeExists(ctx, id);
        if (!exists) {
            throw new Error(`The Employee ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // EmployeeExists returns true when asset with given ID exists in world state.
    async EmployeeExists(ctx, id) {
        const employeeJSON = await ctx.stub.getState(id);
        return employeeJSON && employeeJSON.length > 0;
    }

    // GetAllEmployeeDetails returns all records of employees found in the world state.
    async GetAllEmployeeDetails(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all employees in the chaincode namespace.
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
