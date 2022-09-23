{
  const select = {
    templateOf: {
      templateBook: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      bookImg: '.book__image',
      filters: '.filters'
    },
    all: {
      filterForm: '.filters',
      filtersInputs: '.filters input',
    },
  };

  class BooksList {
    constructor() {
      this.favoriteBooks = [];
      this.filters = [];
      this.initData();
      this.renderBooks();
      this.initActions();
      this.filterBooks();
    }

    initData() {
      this.data = dataSource.books;
    }

    renderBooks() {

      for (let book in this.data) {

        const HTMLData = {
          name: this.data[book].name,
          price: this.data[book].price,
          rating: this.data[book].rating,
          image: this.data[book].image,
          id: this.data[book].id,
          ratingWidth: this.data[book].rating * 10,
          ratingBgc: this.determineRatingBgc(this.data[book].rating)
        };

        const templates = {
          templateBook: Handlebars.compile(document.querySelector(select.templateOf.templateBook).innerHTML),
        };

        const generatedHTML = templates.templateBook(HTMLData);
        book = utils.createDOMFromHTML(generatedHTML);
        const bookContainer = document.querySelector(select.containerOf.booksList);
        bookContainer.appendChild(book);
      }
    }
    getElements() {
      this.dom = {};
      this.dom.books = document.querySelector(select.containerOf.bookList);
      this.dom.filterForm = document.querySelector(select.all.filterForm);
      this.dom.filterInputs = document.querySelectorAll(
        select.all.filtersInputs
      );
    }

    initActions() {

      this.filters = [];
      let favoriteBooks = [];

      document.querySelector(select.containerOf.booksList).addEventListener('dblclick', function (e) {
        e.preventDefault();

        if (!(favoriteBooks.includes(e.target.offsetParent.getAttribute('data-id'))) && e.target.offsetParent.classList.contains('book__image')) {
          favoriteBooks.push(e.target.offsetParent.getAttribute('data-id'));
          e.target.offsetParent.classList.add('favorite');
        }
        else if ((favoriteBooks.includes(e.target.offsetParent.getAttribute('data-id'))) && e.target.offsetParent.classList.contains('book__image')) {
          e.target.offsetParent.classList.remove('favorite');
          const bookIndex = favoriteBooks.indexOf(e.target.offsetParent.getAttribute('data-id'));
          favoriteBooks.splice(bookIndex, 1);
        }

      });

      document.querySelector(select.containerOf.filters).addEventListener('click', (e) => {
        if (e.target.tagName == 'INPUT' && e.target.type == 'checkbox' && e.target.name == 'filter') {
          if (e.target.checked) {
            this.filters.push(e.target.value);
          }
          else if (!e.target.checked) {
            const index = this.filters.indexOf(e.target.value);
            this.filters.splice(index, 1);
          }
        }
        this.filterBooks();
      });

    }

    filterBooks() {
      for (const book of this.data) {
        let shouldBeHidden = false;
        for (const filter of this.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          document
            .querySelector(`[data-id="${book.id}"]`)
            .classList.add('hidden');
        } else {
          document
            .querySelector(`[data-id="${book.id}"]`)
            .classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {

      if (rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }
  new BooksList();

}
