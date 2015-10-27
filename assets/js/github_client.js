

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
        for(var i = 0; i < data.length; i++) {
            var obj = data[i];
            repositories.push(obj.name);
        }
        for (var i = 0; i < repositories.length; i++) {
            $.ajax({
                url: client.github + "repos/"+ client.org + "/" + repositories[i]  + "/pulls",
            }).done(function(data2) {
                for(var i = 0; i < data2.length; i++) {
                    var obj = data2[i];
                    var html = '<tr>';
                    html += '<td>' + obj.number + '</td>';
                    html += '<td>' + obj.head.repo.name + '</td>'
                    html += '<td><a href="' + obj.html_url + '">' + obj.title + '</a></td>';
                    html += '<td>' + obj.user.login + '</td>';
                    html += '<td>' + obj.created_at + '</td>';
                    html += '</tr>';
                    $("#pullrequests").append(html);
                }
            });
        }
    });

}
