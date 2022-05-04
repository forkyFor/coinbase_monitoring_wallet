# coinbase_monitoring_wallet


Project for monitoring your wallet of coins that you have on coinbase.

The features offered are:

- Alert via email if any coins exceed a capital gain threshold compared to the average purchase price

- Report on csv file of all purchased coins with the following information:

    1) CURRENCY: name of the currency
    2) NUM TRANSACTIONS: number of transactions you have performed for that coin
    3) AMOUNT INVESTED: how much you have invested for that currency based on your transaction history ($ or €)
    4) ACTUAL AMOUNT: current value of your investment for that currency ($ or €)
    5) AVERAGE PRICE FOR MONEY: average purchase price for that coin ($ or €)
    6) ACTUAL PRICE COIN: current purchase price for that coin ($ or €)
    7) PERCENTAGE DIFFERENCE: current gain or loss for that currency

- automatic transfer between coins (still to be completed!)


## Installation and configuration

### Stack required on the server to start the application:

1) Node 16.13.0
2) Install npm associated modules
3) Launch command "npm run start"

### Coinbase account setup
1) request new API key
2) associate the coins you want to monitor through the application
3) associate the following permissions:
      1) wallet:accounts:read
      2) wallet:contacts:read
      3) wallet:deposits:read
      4) wallet:trades:read
      5) wallet:user:read
      6) address
      7) wallet:addresses:read
      8) wallet:buys:read
      9) wallet:checkouts:read
      10) wallet:notifications:read
      11) wallet:orders:read
      12) wallet:payment-methods:read
      13) wallet:sells:read
      14) wallet:transactions:read
      15) wallet:withdrawals:read

### Configuration file "vars.yaml" on the root of the project (here is the description of the fields)
1.	API_KEY: key acquired from your coinbase account in the API section https://www.coinbase.com/settings/api
2.	SECRET_KEY: key acquired from your coinbase account in the API section https://www.coinbase.com/settings/api
3.	MAIL_NOTIFY: support mail used for sending application notifications
4.	PWD_MAIL_NOTIFY: pwd of support mail used for sending application notifications
5.	MAIL_DEST_NOTIFY: mail where notifications and reports will arrive
6.	PROVIDER_MAIL_NOTIFY: support email provider (for example gmail)
7.	PERCENTAGE_THRESHOLD_NOTIFY: capital gain threshold that is exceeded sends an email (for example '10' if you want the alert to be sent after exceeding a gain of 10%) (default: 10%)
8.	BOOL_MAIL_NOTIFY: boolean value that allows you to send the e-mail for the notification of capital gain (default: true) 
9.	BOOL_WRITE_CSV: boolean value that allows you to write the csv with the fields described in the first paragraph on the server (default: true)
10.	BOOL_AUTOMATIC_TRANSFER: boolean value that allows you to start automatic transactions between coins in your wallet (still not working! default: false)
11.	BOOL_MAIL_NOTIFY_TRANSACTION: boolean value that allows you to receive a notification for each automatic transaction performed (still not working! default: false)
12.	BOOL_REPORT_CSV: boolean value that allows you to receive the csv report of the current situation of your wallet via email
13.	PATH_WALLET_CSV: path where the csv report will be written to the server
14.	INTERVAL_SECONDS_UPDATE_WALLET: defines the seconds between two successive wallet updates (default: 10 seconds)
15.	INTERVAL_SECONDS_WRITE_CSV: defines the seconds between two successive updates of the csv report written on the server (default: 30 seconds)
16.	INTERVAL_MINUTES_SEND_CSV_BY_MAIL: defines the minutes between two successive sending of the csv report by e-mail (default: 3 hours)
