module budgetbuddy::budget_tracker {
    use sui::event;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use std::vector;

    struct Transaction has key, store {
        id: UID,
        amount: u64,
        category: String,
        payee: String,
        timestamp: u64,
        is_waste: bool,
    }

    struct Budget has key, store {
        id: UID,
        category: String,
        limit: u64,
        spent: u64,
    }

    struct TransactionRecorded has copy, drop {
        amount: u64,
        category: String,
        payee: String,
        timestamp: u64,
    }

    struct BudgetUpdated has copy, drop {
        category: String,
        limit: u64,
        spent: u64,
    }

    public entry fun record_transaction(
        amount: u64,
        category: vector<u8>,
        payee: vector<u8>,
        ctx: &mut TxContext
    ) {
        let cat = string::utf8(category);
        let pay = string::utf8(payee);
        let timestamp = tx_context::epoch(ctx);
        
        let txn = Transaction {
            id: object::new(ctx),
            amount: amount,
            category: cat,
            payee: pay,
            timestamp: timestamp,
            is_waste: false,
        };

        transfer::transfer(txn, tx_context::sender(ctx));

        event::emit(TransactionRecorded {
            amount: amount,
            category: string::utf8(category),
            payee: string::utf8(payee),
            timestamp: timestamp,
        });
    }

    public entry fun set_budget(
        category: vector<u8>,
        limit: u64,
        ctx: &mut TxContext
    ) {
        let cat = string::utf8(category);
        
        let budget = Budget {
            id: object::new(ctx),
            category: cat,
            limit: limit,
            spent: 0,
        };

        transfer::transfer(budget, tx_context::sender(ctx));

        event::emit(BudgetUpdated {
            category: string::utf8(category),
            limit: limit,
            spent: 0,
        });
    }

    public entry fun mark_as_waste(
        txn: &mut Transaction,
        ctx: &mut TxContext
    ) {
        txn.is_waste = true;
    }
}