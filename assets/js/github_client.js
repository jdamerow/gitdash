

function GithubClient(organization) {
    this.github = "https://api.github.com/"
    this.org = organization;

    this.getOrganisation = function() {
        return this.org;
    }
}

function getRepositories(client) {
    $.ajax({
        url: client.github + "orgs/"+ client.org + "/repos",
    }).done(function(data) {
        for(var i = 0; i < data.length; i++) {
            var obj = data[i];
            html = '<li><a href="' + obj.html_url + '">' + obj.name + '</a></li>';
            $( "#repos" ).append(html);
        }
    });
}

function getPullRequests(client) {
    var repositories = []
    $.ajax({
        url: client.github + "orgs/"+ client.org + "/repos",
    }).done(function(data) {
        var data_json = []

        for(var i = 0; i < data.length; i++) {
            var obj = data[i];
            repositories.push(obj.name);
        }
        for (var i = 0; i < repositories.length; i++) {

            $.ajax({
                url: client.github + "repos/"+ client.org + "/" + repositories[i]  + "/pulls",
                async: false
            }).done(function(data2) {

                for(var i = 0; i < data2.length; i++) {
                    var obj = data2[i];
                    var date = new Date(obj.created_at);
                    var date_str = moment(date).format("MM/DD/YYYY hh:mm:ss a");
                    data_json.push({number: obj.number.toString(), repository: obj.head.repo.name, title: '<a href="' + obj.html_url + '">' + obj.title + '</a>', user: obj.user.login, created: date_str});
                }
            });
        }
        $('#pullrequests').bootstrapTable({
            striped: true,
            columns: [{
                field: 'number',
                title: 'PR#',
                sortable: true
            }, {
                field: 'repository',
                title: 'Repository',
                sortable: true
            }, {
                field: 'title',
                title: 'Title',
                sortable: true
            }, {
                field: 'user',
                title: 'User',
                sortable: true
            }, {
                field: 'created',
                title: 'Created',
                sortable: true
            }],
            data: data_json
        });
    });

}
