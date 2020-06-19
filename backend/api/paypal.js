module.exports = (express, wagner) => {
    const router = express.Router();
    const paypal = require("paypal-rest-sdk");

    router.post("/", (req, res) => {
        const params = {
            employer_id: req.body.employer_id,
            membership_id: req.body.membership_id,
            membership_type: req.body.membership_type,
            price: req.body.price,
        };

        var create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: "http://10e7b85e375a.ngrok.io/api/paypal/success",
                cancel_url: "http://10e7b85e375a.ngrok.io/api/paypal/cancel",
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: params.membership_type,
                                sku: "item",
                                price: params.price,
                                currency: "AUD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "AUD",
                        total: params.price,
                    },
                    description: params.membership_type,
                },
            ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res.sendStatus(500).send({success: false, error});
            } else {
                params.transaction_token = payment.links[1].href.split(
                    "token="
                )[1];
                wagner
                    .get("EmployerPaymentManager")
                    .createNewTransaction(params)
                    .then((result) => {
                        return res.send({
                            success: true,
                            url: payment.links[1].href,
                        });
                    })
                    .catch((err) => {
                        console.log("------->", err);
                        return res.sendStatus(500).send(err);
                    });
            }
        });
    });

    router.get("/success", (req, res) => {
        var PayerID = req.query.PayerID;
        var paymentId = req.query.paymentId;
        wagner
            .get("EmployerPaymentManager")
            .getTransaction(req.query.token)
            .then((transaction) => {
                if (transaction !== null) {
                    const execute_payment_json = {
                        payer_id: PayerID,
                        transactions: [
                            {
                                amount: {
                                    currency: "AUD",
                                    total: transaction.price,
                                },
                            },
                        ],
                    };
                    paypal.payment.execute(
                        paymentId,
                        execute_payment_json,
                        function (error, payment) {
                            if (error) {
                                // throw error;
                                return res
                                    .status(500)
                                    .send({success: false, error});
                            } else {
                                const parameters = {
                                    status: payment.state,
                                    transaction_id: payment.id,
                                    transaction_token: req.query.token,
                                };
                                wagner
                                    .get("EmployerPaymentManager")
                                    .updatePayment(parameters)
                                    .then((result) => {
                                        if (result !== null)
                                            return res.send({success: true});
                                        else
                                            return res.sendStatus(500).send({
                                                success: false,
                                                err:
                                                    "Unable to process payment",
                                            });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return res.sendStatus(401).send({
                                            success: false,
                                            err: "No transaction found",
                                        });
                                    });
                            }
                        }
                    );
                }
            });
    });

    router.get("/cancel", (req, res) => {
        return res.send({message: "cancel"});
    });

    return router;
};
