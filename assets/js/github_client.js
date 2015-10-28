

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
        }]
    });
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
            }).done(function(data2) {

                for(var i = 0; i < data2.length; i++) {
                    var obj = data2[i];
                    var date = new Date(obj.created_at);
                    var date_str = moment(date).format("MM/DD/YYYY hh:mm:ss a");
                    $('#pullrequests').bootstrapTable('append', {number: obj.number.toString(), repository: obj.head.repo.name, title: '<a href="' + obj.html_url + '">' + obj.title + '</a>', user: obj.user.login, created: date_str});
                }
            });
        }

    });
}

function getActivity(client) {
    $.ajax({
        url: client.github + "orgs/"+ client.org + "/events",
    }).done(function(data) {
        for(var i = 0; i < data.length; i++) {
            var obj = data[i];
            var label_class = 'label-danger';
            var label_text = obj.type;
            var text = obj.actor.login + ' on <a href="https://github.com/' + obj.repo.name + '">' + obj.repo.name + '</a>.';
            var date = new Date(obj.created_at);
            var date_str = moment(date).format("MM/DD/YYYY hh:mm:ss a");
            if (obj.type == 'PushEvent') {
                label_class = 'label-primary';
                label_text = 'Push';
                text = obj.actor.login + ' pushed to <a href="https://github.com/' + obj.repo.name + '">' + obj.repo.name + '</a>.';
            }
            else if (obj.type == 'PullRequestEvent') {
                label_class = 'label-warning';
                label_text = 'Pull Request';
                text = obj.actor.login + ' created a pull request on <a href="' + obj.payload.pull_request.html_url + '">' + obj.repo.name + '</a>.';
            }
            else if (obj.type == 'PullRequestReviewCommentEvent') {
                label_class = 'label-info';
                label_text = 'PR Comment';
                text = obj.actor.login + ' commented on <a href="' + obj.payload.pull_request.html_url + '"> pull request #' + obj.payload.pull_request.number + '</a> for repository <a href="https://github.com/' +  obj.repo.name + '">' + obj.repo.name + '</a> saying "' + obj.payload.comment.body + '".';
            }
            else if (obj.type == 'IssueCommentEvent') {
                label_class = 'label-success';
                label_text = 'Issue Comment';
                text = obj.actor.login + ' commented on <a href="' + obj.payload.issue.html_url + '">' + obj.payload.issue.title + '</a> for repository <a href="https://github.com/' +  obj.repo.name + '">' + obj.repo.name + '</a> saying "' + obj.payload.comment.body + '".';
            }
            html = '<p><span class="label ' + label_class + '">' + label_text + '</span> <small>[' + date_str + ']</small> ' + text + '</p>';
            $( "#activityList" ).append(html);
        }
    });
}
