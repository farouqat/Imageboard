(function() {
    Vue.component('image-modal', {
        template: "#modal-template",
        props: ["id"],
        data:function () {
            return {
                comments:[],
                imageinfo:{},
                username: "",
                comment: ""
            };
        },
        mounted: function() {
            console.log("this id :", this.id);
            Promise.all([
                axios.get('/modal/'+ this.id),
                axios.get('/comments/' + this.id)
            ]).then(function(results) {
                console.log("results 1 . data : " , results[1].data);
                this.comments  = results[1].data;
                this.imageinfo = results[0].data[0];
                console.log("this comment", this.comments);
            }.bind(this));
        },
        methods: {
            sendCloseEvent: function(e) {
                if   (e.target == document.getElementById('modal-template')) {
                    this.$emit('close');
                }  else {
                    return;
                }
            },
            addComment: function () {
                let self = this;
                var commentinfo = {
                    comment: self.comment,
                    username: self.username,
                    image_id: self.id
                };
                axios.post("/addcomment", commentinfo)
                    .then(function(results) {
                        console.log("results from axios", results);
                        self.comment.unshift(results.data[0]);
                        console.log("results.dataaaaaa add comment",results);
                    });
                // axios.get("/image", self.id).then(function (results){
                //     console.log("/image results", results);
                // });
            }
        }
    });
    new Vue({
        el: '#main',
        data: {
            images: [],
            form: {
                title: '',
                name: '',
                description: '',
                file: null
            },
            currentImage: null
        },
        mounted: function() {
            var self = this;
            axios.get('/images').then(function(response) {
                self.images = response.data.images;
            }).catch(function (err) {
                console.log("error!", err);
            });
        },
        methods: {
            uploadFile: function (e){
                e.preventDefault();
                var self = this;
                var file = document.getElementById('file');
                var uploadedFile = file.files[0];
                var formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('title', this.form.title);
                formData.append('name', this.form.name);
                formData.append('description', this.form.description);
                axios.post('/upload', formData).then(function(response) {
                    self.images.unshift(response.data);
                })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            showmodal: function(image_id) {
                this.currentImage = image_id;
            },
            hidemodal: function() {
                this.currentImage = null;
            }
        }

    });
})();
