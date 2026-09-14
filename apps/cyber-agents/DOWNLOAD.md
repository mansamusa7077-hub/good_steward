# Good Steward Cyber Guardian — Download Edition

This package performs a local, read-only defensive scan of a folder you own or are authorized to assess. It does not upload the folder, reveal detected secret values, exploit systems, or make automatic changes.

## Requirements

Install Node.js 20 or newer from the official Node.js website.

## Windows

1. Extract the downloaded ZIP.
2. Drag the folder you want to check onto `run-agent.cmd`, or open Command Prompt in the extracted agent folder and run:
   ```bat
   run-agent.cmd "C:\path\to\authorized\project"
   ```
3. Read the report at `.good-steward\evidence-ledger.json` inside the checked folder.

## macOS or Linux

1. Extract the ZIP.
2. In Terminal, enter the extracted directory.
3. Run:
   ```sh
   chmod +x run-agent.sh
   ./run-agent.sh "/path/to/authorized/project"
   ```
4. Read `.good-steward/evidence-ledger.json` inside the checked folder.

## Result codes

- `0`: no medium- or high-severity findings
- `1`: one or more medium-severity findings
- `2`: one or more high-severity findings
- `3`: the scan could not complete

A finding is a review signal, not proof of compromise. Confirm it before taking action.
