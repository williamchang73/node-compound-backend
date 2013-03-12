load('application');

before(loadCompany, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New company';
    this.company = new Company;
    render();
});

action(function create() {
    Company.create(req.body.Company, function (err, company) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: company && company.errors || err});
                } else {
                    send({code: 200, data: company.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Company can not be created');
                    render('new', {
                        company: company,
                        title: 'New company'
                    });
                } else {
                    flash('info', 'Company created');
                    redirect(path_to.companies);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Companys index';
    Company.all(function (err, companies) {
        switch (params.format) {
            case "json":
                send({code: 200, data: companies});
                break;
            default:
                render({
                    companies: companies
                });
        }
    });
});

action(function show() {
    this.title = 'Company show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.company});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Company edit';
    switch(params.format) {
        case "json":
            send(this.company);
            break;
        default:
            render();
    }
});

action(function update() {
    var company = this.company;
    this.title = 'Edit company details';
    this.company.updateAttributes(body.Company, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: company && company.errors || err});
                } else {
                    send({code: 200, data: company});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Company updated');
                    redirect(path_to.company(company));
                } else {
                    flash('error', 'Company can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.company.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy company');
                } else {
                    flash('info', 'Company successfully removed');
                }
                send("'" + path_to.companies + "'");
            });
        });
    });
});

function loadCompany() {
    Company.find(params.id, function (err, company) {
        if (err || !company) {
            if (!err && !company && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.companies);
        } else {
            this.company = company;
            next();
        }
    }.bind(this));
}
