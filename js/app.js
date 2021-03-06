// WERSJA 1
// ZADANIE 1-6

// $(document).ready(function() {
//     // Wypelnianie HTML
//
//     function laduj() {
//         $.get("http://localhost:8000/book/")
//         .done(function (result) {
//             for (var i = 0; i < result.length; i++) {
//                 var tr = $("<tr>");
//                 tr.append($(`<td>${result[i].author}</td>`));
//                 tr.append($(`<td><a class="title" href="#" id=${result[i].id}>${result[i].title}</a></td>`));
//                 tr.append($(`<td><a class="delete" href="#" id=${result[i].id}>delete</a></td>`));
//
//                 $(".filled").append(tr);
//             }
//
//             // Rozwijane menu z detalami.
//
//             let tbody = $(".title");
//
//             tbody.on("click", function () {
//
//                 if ($(this).closest("tr").next().attr("class") === "details") {
//                     $(this).closest("tr").next().remove()
//                 } else {
//                     var element = $(this).attr("id");
//                     let clickedElement = $(this);
//
//                     $.get(`http://localhost:8000/book/${element}`)
//                         .done(function (book) {
//
//                             var lineToAdd = $(`<tr class="details">
//                                                 <td colspan="2">ISBN: ${book.isbn} <br>
//                                                 PUBLISHER: ${book.publisher}   <br>
//                                                 GENRE: ${book.genre}
//                                                 </td>
//                                                 </tr>`);
//                             clickedElement.closest("tr").after(lineToAdd)
//
//                         })
//                         .fail(function () {
//                             console.log("nie udalo sie!!");
//                         });
//                 }
//             });
//
//         }).always(function () {
//             $(".delete").click(function () {
//                 $.ajax({
//                     url: `http://localhost:8000/book/${$(".delete").attr("id")}`,
//                     data: {},
//                     type: "Delete",
//                     dataType: "json"
//                 })
//                 console.log("Delete poszlo")
//                 location.reload()
//             })
//         });
//     }
//
//     laduj();
//
//     $("form").on( "submit", function( event ) {
//         event.preventDefault();
//         var formData = $("form").serialize();
//         console.log(formData);
//
//         $.post("http://localhost:8000/book/", formData)
//             .done(function () {
//                 laduj()
//             })
//
//         });
// });


// --------------------------------------------------------------------------------------
// WERSJA # 2
// ZADANIE 7

$(function () {

    // Funkcja ladowania strony

    function load_web (result){
        for (var i = 0; i < result.length; i++) {
                var tr = $("<tr>");
                tr.append($(`<td>${result[i].author}</td>`));
                tr.append($(`<td><a class="title" href="#" data-type="GET"  id=${result[i].id}>${result[i].title}</a></td>`));
                tr.append($(`<td><a class="delete" href="#" data-type="DELETE" id=${result[i].id}>delete</a></td>`));

                $(".filled").append(tr);
            }
        $("tbody tr:odd").addClass("table-info")
    }



    // NASA API

    function NASA_API() {
        var url = 'https://api.nasa.gov/planetary/apod?api_key=E3EAxenYqulQaMNtdVNwjZ6S260MSmDtKhkFknDL';

        $.ajax({
          url: url,
          success: function(result){
          if("copyright" in result) {
            $("#copyright").text("Image Credits: " + result.copyright);
          }
          else {
            $("#copyright").text("Image Credits: " + "Public Domain");
          }

          if(result.media_type == "video") {
            $("#apod_img_id").css("display", "none");
            $("#apod_vid_id").attr("src", result.url);
          }
          else {
            $("#apod_vid_id").css("display", "none");
            $("#apod_img_id").attr("src", result.url);
          }

          $("#reqObject").text(url);
          $("#returnObject").text(JSON.stringify(result, null, 4));
          $("#apod_explaination").text(result.explanation);
          $("#apod_title").text(result.title);
        }
        });
    }

    // Funkcja rozwijajaca menu

    function details_menu () {


        let tbody = $(".title");
        let data_type = tbody.data("type");

        tbody.on("click", function () {

            if ($(this).closest("tr").next().attr("class") === "details") {
                $(this).closest("tr").next().remove()
            } else {
                var element = $(this).attr("id");
                let clickedElement = $(this);

                ajax_querry(id = element, type = data_type, data = undefined)
                    .done(function (book) {

                        var lineToAdd = $(`<tr class="details">
                                            <td colspan="3">ISBN: ${book.isbn} <br>
                                            PUBLISHER: ${book.publisher}   <br>
                                            </td>
                                            </tr>`);
                        clickedElement.closest("tr").after(lineToAdd)

                    })
                    .fail(function () {
                        console.log("nie udalo sie!!");
                    });
            };
        })
    }


    // Funkcja usuwajaca element

    function delete_item () {

        let remove_item = $(".delete")

        let data_type = remove_item.data("type");

        remove_item.click(function () {
             var delete_id = $(this).attr("id");

            ajax_querry(id=delete_id, type=data_type, data=undefined)
                console.log("Delete poszlo")
                $(this).closest('tr').remove()
            })

    }


    // Funkcja dodajaca elementu

    function add_item () {



        $("form").on( "submit", function( event ) {
        event.preventDefault();
        var formData = $("form").serialize();
        console.log(formData);

        let data_type = $("button").data("type")

        ajax_querry(id="", type=data_type, formData)
        .done(function () {
            location.reload()
        })

        });
    }

    // Ajax

    function ajax_querry(id, type, data) {

        var result = $.ajax({
                    url: `http://localhost:8000/book/${id}`,
                    data: data,
                    type: type,
                    dataType: "json"
                });
        return result
    };

    // -------------------------
    // EGZEKUCJA


    ajax_querry(id="", "GET", data=undefined)
        .done(function (result) {

            // Ladowanie strony

            load_web(result)

            // Rozwijane menu z detalami

            details_menu()

        }).always(function () {

            //Usuwanie elementów

            delete_item()

        });

    add_item()

    NASA_API()

});

