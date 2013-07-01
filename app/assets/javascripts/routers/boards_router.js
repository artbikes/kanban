Kanban.Routers.Boards = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    "": "index",
    "boards/:id": "show"
  },

  index: function () {
    var that = this;

    var boardsIndex = new Kanban.Views.BoardsIndex({
      collection: Kanban.boards
    });

    that.$rootEl.html(boardsIndex.render().$el);
  },

  show: function (id) {
    var that = this;

    console.log("show page");
    var board = Kanban.boards.get(id);
    var boardShow = new Kanban.Views.BoardShow({
      model: board
    });

    that.$rootEl.html(boardShow.render().$el);

    sortListsUrl = "/api/lists/sort"
    var $lists = that.$rootEl.find("div.lists");
    $lists.sortable({
      axis: "x",
      update: function (data) {
        var sortData = $(this).sortable("serialize");
        $.post(sortListsUrl, sortData, function (resortedLists) {
          board.set({ lists: new Kanban.Collections.Lists(resortedLists) });
        });
      }
    });

    sortCardsUrl = "/api/cards/sort"
    var $cards = $lists.find("div.cards");
    $cards.sortable({
    // $( "#cards_list_1, #cards_list_2, #cards_list_3, #cards_list_7" ).sortable({
      // axis: "y",
      // scope: ".cards",
      connectWith: ".cards",
      delay: 150,
      update: function () {
        var sortData = $(this).sortable("serialize");

        var listId = parseInt($(this).data("listId"));
        var list = board.lists().get({ id: listId });
        console.log("list");
        console.log(list);
 
        $.post(sortCardsUrl, sortData, function (resortedCards) {
          list.set({ cards: new Kanban.Collections.Cards(resortedCards) });
        });
      }
    });
  }

});
