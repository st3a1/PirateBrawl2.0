class Quickpay {
    constructor(receiver, quickpay_form, targets, paymentType, sum, formcomment=null, short_dest=null, label=null, comment=null, successURL=null, need_fio=null, need_email=null, need_phone=null, need_address=null) {
        this.receiver = receiver;
        this.quickpay_form = quickpay_form;
        this.targets = targets;
        this.paymentType = paymentType;
        this.sum = sum;
        this.formcomment = formcomment;
        this.short_dest = short_dest;
        this.label = label;
        this.comment = comment;
        this.successURL = successURL;
        this.need_fio = need_fio;
        this.need_email = need_email;
        this.need_phone = need_phone;
        this.need_address = need_address;
    }

    async request() {
        let base_url = "https://yoomoney.ru/quickpay/confirm.xml?";
        let payload = {
            receiver: this.receiver,
            quickpay_form: this.quickpay_form,
            targets: this.targets,
            paymentType: this.paymentType,
            sum: this.sum,
            formcomment: this.formcomment,
            short_dest: this.short_dest,
            label: this.label,
            comment: this.comment,
            successURL: this.successURL,
            need_fio: this.need_fio,
            need_email: this.need_email,
            need_phone: this.need_phone,
            need_address: this.need_address
        };

        for (let [key, value] of Object.entries(payload)) {
            if (value !== null && value !== undefined) {
                base_url += key.replace("_", "-") + "=" + encodeURIComponent(value) + "&";
            }
        }

        base_url = base_url.slice(0, -1);

        let response = await fetch(base_url, {
            method: 'POST'
        });

        this.redirected_url = response.url;

        return { response, redirected_url: this.redirected_url };
    }
}

module.exports = Quickpay;