const update = document.querySelector("#update-button");
const deleteButton = document.querySelector("#delete-button");

update.addEventListener("click", function () {
	fetch("contacts", {
		method: "put",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "person",
			number: 77777777,
		}),
	})
		.then((response) => {
			if (response.ok) return response.json();
		})
		.then((data) => {
			console.log(data);
		});
});

deleteButton.addEventListener("click", () => {
	fetch("/contacts", {
		method: "delete",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "teste",
		}),
	})
		.then((res) => {
			if (res.ok) return res.json();
		})
		.then((data) => {
			window.location.reload();
		});
});
