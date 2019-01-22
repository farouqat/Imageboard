(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            form: {
                title: '',
                name: '',
                description: '',
                file: null
            }
        },
        // every function that i want to run in respone to an event should go in methods
        mounted: function() {
            var self = this;
            axios.get('/images').then(function(response) {
                console.log("response!!!!!!", response.data);
                self.images = response.data;
            }).catch((err) => {
                console.log("error!!!!!!!!!", err);
            });
        }
        // ,
        // methods: {
        //     uploadFile: function (e){
        //         e.preventDefault();
        //         var file = document.getElementById('file');
        //         var uploadedFile = file.files[0];
        //
        //         // we want to send uploadedFile to the server
        //         //we use FormData to send files to isServerRendering
        //
        //         var formData = new FormData();
        //         formData.append('file', uploadedFile);
        //         formData.append('title', this.form.title);
        //         formData.append('name', this.form.name);
        //         formData.append('description', this.form.description);
        //
        //         axios.post('/upload', formData).then(function() {
        //         });
        //     }
        // }
    });
})();
