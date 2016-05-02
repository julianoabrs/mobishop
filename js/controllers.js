angular.module('starter.controllers', ['starter', 'ionic', 'uiGmapgoogle-maps', 'firebase'])

	.controller('MapCtrl', function($scope, $firebaseArray, $interval) {
		$scope.currentWindow;
		
		$scope.map = {
			center: {latitude: -29.6107169, longitude: -52.0687541}, 
			zoom: 8,
			window: {
				model: {},
				options:{
					pixelOffset: {width:-1,height:-20}
				},
				closeClick: function(params) {
					$scope.map.window.show = false;					
				}
			},
			markersEvents: {
				click: function(marker, eventName, model, args) {
					$scope.map.window.model = model;
					$scope.map.window.show = true;
				
				}
			}
		 };
		
		var ref = new Firebase("https://dazzling-heat-4550.firebaseio.com/sessions/panvel")
		
		
		var menos8minutos = parseInt(moment().subtract(8, 'minutes').format('x'));
		$scope.secao = $firebaseArray(ref.orderByChild("updatedAt").startAt(menos8minutos));
		
		$scope.secao.$loaded()
			.then(function(){
				angular.forEach($scope.secao, function(item) {
					item.icon = tipoIcone(item);
					
					var agora = moment();
					var horaItem = moment(item.updatedAt);
					item.tempo = moment.duration(agora.diff(horaItem)).asMinutes();
				})
			});
		
		
		ref.orderByChild("updatedAt").startAt(menos8minutos).on('child_changed', function(childSnapshot, prevChildKey) {
			angular.forEach($scope.secao, function(item) {
					item.icon = tipoIcone(item);
					
					var agora = moment();
					var horaItem = moment(item.updatedAt);
					item.tempo = moment.duration(agora.diff(horaItem)).asMinutes();
				})
			
		});
		
		$interval(function(){			
			ref = new Firebase("https://dazzling-heat-4550.firebaseio.com/sessions/panvel")
			
			
			var menos8minutos = parseInt(moment().subtract(8, 'minutes').format('x'));
			$scope.secao = $firebaseArray(ref.orderByChild("updatedAt").startAt(menos8minutos));
			
			$scope.secao.$loaded()
				.then(function(){
					angular.forEach($scope.secao, function(item) {
						item.icon = tipoIcone(item);
					
						var agora = moment();
						var horaItem = moment(item.updatedAt);
						item.tempo = moment.duration(agora.diff(horaItem)).asMinutes();
					})
				});
			
			
			ref.orderByChild("updatedAt").startAt(menos8minutos).on('child_changed', function(childSnapshot, prevChildKey) {
				angular.forEach($scope.secao, function(item) {
						item.icon = tipoIcone(item);
					
						var agora = moment();
						var horaItem = moment(item.updatedAt);
						item.tempo = moment.duration(agora.diff(horaItem)).asMinutes();
					})
				
			});
		}, 1000*60*1);
		
		var tipoIcone = function(item){			
			var icone = "img/panvelPin.png";
				
			var menos5minutos = parseInt(moment().subtract(5, 'minutes').format('x'));
			
			//se menos5minutos (tempo atual menos 5) for menor que updatedAt, o item atual segue online, caso contrário, offline
			
			var online = item.updatedAt >= menos5minutos;
			
			var totalCarrinho = item.basket !== undefined && item.basket.freight !== undefined ? item.basket.freight.amount : 0;
			
			if (item.basket !== undefined){
				angular.forEach(item.basket.items, function(carrinhos, index) {
					var precoUnitario = 0;
					var qtd = 0;
					angular.forEach(carrinhos, function(value, key) {
						if (key == 'unitPrice'){
							precoUnitario = value;
						} else if (key == 'quantity'){
							qtd = value;
						}
					});				
					totalCarrinho = totalCarrinho + (qtd * precoUnitario);
				});
			}
			
			var carrinhoGrande = true;
			if (totalCarrinho < 100)
				carrinhoGrande = false;
						
			switch (item.flow){
		
				case 'INÍCIO':
					if (carrinhoGrande && online){
						icone = "img/Pin_ON_G_1-3.png";
					} else if (carrinhoGrande && !online){
						icone = "img/Pin_OFF_G_1-3.png";
					} else if (!carrinhoGrande && online){
						icone = "img/Pin_ON_N_1-3.png";
					} else if (!carrinhoGrande && !online){
						icone = "img/Pin_OFF_N_1-3.png";
					}
					
					break;
				case 'ENTREGA':
					if (carrinhoGrande && online){
						icone = "img/Pin_ON_G_2-3.png";
					} else if (carrinhoGrande && !online){
						icone = "img/Pin_OFF_G_2-3.png";
					} else if (!carrinhoGrande && online){
						icone = "img/Pin_ON_N_2-3.png";
					} else if (!carrinhoGrande && !online){
						icone = "img/Pin_OFF_N_2-3.png";
					}
					
					break;
				case 'PAGAMENTO':
					if (carrinhoGrande && online){
						icone = "img/Pin_ON_G_3-3.png";
					} else if (carrinhoGrande && !online){
						icone = "img/Pin_OFF_G_3-3.png";
					} else if (!carrinhoGrande && online){
						icone = "img/Pin_ON_N_3-3.png";
					} else if (!carrinhoGrande && !online){
						icone = "img/Pin_OFF_N_3-3.png";
					}
					
					break;
				case 'FIM':
					if (carrinhoGrande && online){
						icone = "img/Pin_ON_G_FIM.png";
					} else if (carrinhoGrande && !online){
						icone = "img/Pin_OFF_G_FIM.png";
					} else if (!carrinhoGrande && online){
						icone = "img/Pin_ON_N_FIM.png";
					} else if (!carrinhoGrande && !online){
						icone = "img/Pin_OFF_N_FIM.png";
					}
					
					break;
			}
			return icone;
			
		}

		/*var secao = $firebaseArray(ref);
		$scope.map.markers = [];
		secao.$loaded()
			.then(function(){
				angular.forEach(secao, function(item) {
					var itemJson = new Object();
					itemJson.id = item.carID;
					itemJson.passoFluxo = item.passofluxo;
					itemJson.nomeUsuario = item.usuario.nome;
					itemJson.valorFrete = item.frete.valorFrete;
					itemJson.latitude = item.lat;
					itemJson.longitude = item.long;
					itemJson.icon = 'img/panvelPin.png';
					
					itemJson.carrinho = item.carrinho;
					
					$scope.map.markers.push(itemJson);
				})
			});
			
		ref.on('child_changed', function(childSnapshot, prevChildKey) {
			ref = new Firebase("https://burning-inferno-1256.firebaseio.com/sessao");
			secao = $firebaseArray(ref);
			
			
			secao.$loaded()
				.then(function(){
					angular.forEach(secao, function(item) {
						var itemJson = new Object();
						itemJson.id = item.carID;
						itemJson.passoFluxo = item.passofluxo;
						itemJson.nomeUsuario = item.usuario.nome;
						itemJson.valorFrete = item.frete.valorFrete;
						itemJson.latitude = item.lat;
						itemJson.longitude = item.long;
						itemJson.icon = 'img/panvelPin.png';
						
						itemJson.carrinho = item.carrinho;
						
						$scope.map.markers.push(itemJson);
					})
				});
		});
		*/	
			
    })
	
	.controller('WindowMapCtrl', function($scope){
		
		$scope.valorSecao = function(carrinho, valorFrete){
			var total = valorFrete ? valorFrete : 0;
			angular.forEach(carrinho, function(carrinhos, index) {
				var precoUnitario = 0;
				var qtd = 0;
				angular.forEach(carrinhos, function(value, key) {
					if (key == 'unitPrice'){
						precoUnitario = value;
					} else if (key == 'quantity'){
						qtd = value;
					}
				});				
				total = total + (qtd * precoUnitario);
			});
			return total;
		};
	})
;