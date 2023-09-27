# Archway Integration

## Deployment

```
Transaction: CC3619B221F04545D3A95860AF601D6E475099C90AC57FB7A190DFCAA4CA63C7
```

## Instantiate

```
// archway contracts instantiate archway  --args '{"count":0}'
✔ Enter the name or address of the account that will send the transaction … test
Instantiating contract archway
  Chain: archway-1
  Code: 184
  Label: archway-0.1.0
  Admin: archway1mem9l5x2hqeh93t62g5e4g7x3v0w9spwfzx4kv
  Signer: test

✅ Contract archway-0.1.0 instantiated
  Address: archway1tqfuly7tfcp7cfqfjq7nlv0xqhlpq3sjlcmgq2edxvky5r9k5qwq77lqkz
  Transaction: 2EF7C1240209077D4AB9EBF356A62CB593E3A347D99D5D28A02C361DADE93277
```

## Metadata

```
// archway contracts metadata archway --owner-address archway1mem9l5x2hqeh93t62g5e4g7x3v0w9spwfzx4kv --rewards-address archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3
✔ Enter the name or address of the account that will send the transaction … test
Setting metadata for contract archway
  Chain: archway-1
  Contract: archway1tqfuly7tfcp7cfqfjq7nlv0xqhlpq3sjlcmgq2edxvky5r9k5qwq77lqkz
  Rewards: archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3
  Owner: archway1mem9l5x2hqeh93t62g5e4g7x3v0w9spwfzx4kv
  Signer: test

✅ Metadata for the contract archway-0.1.0 updated
  Transaction: 81C779E5A8B60069E4EA022EE30E87D8CE107C3BAF21869F246BBEDC81D88171
```

## Exexute

```
archway contracts execute archway --args '{"increment": {}}' --gas-adjustment 1.4
✔ Enter the name or address of the account that will send the transaction … test
Executing contract archway
  Chain: archway-1
  Signer: test

✅ Executed contract  archway-0.1.0
  Transaction: 0EF329C80710B7251CDDBE31D07BD0B52DA7DC6984B32CED5729989DF2063CAA
```

## Reward

archway rewards query archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3
Outstanding rewards for archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3 (archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3)

- 0.088681102069388332 ARCH (88681102069388332aarch)

## Withdraw

```
archway rewards withdraw
✔ Enter the name or address of the account that will send the transaction … dev
Withdrawing rewards from dev (archway1mzctggcrjqpjqdlvus6skpdrq6jpylz6mvels3)

✅ Successfully claimed the following rewards:
```

This is tx hash.

https://www.mintscan.io/archway/tx/2D19D9E2E913C2E8992F9E1F2F5BC48860D7974EB5D594EB3301F13B8F50A496?height=1233438
