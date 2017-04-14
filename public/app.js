var app = angular.module('fupApp', [])
app.controller('fileUpload', function ($scope,$http) {
  
  $scope.gridOptions = {};
  $scope.submitexcel = function (){
    $scope.classdata = $scope.gridOptions.data;
	//alert(JSON.stringify($scope.classdata));
	$http({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        data: $scope.classdata,
		headers : { 'Content-Type': 'application/json' }  
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
    })
	}
  
})




app.directive("fileread", ["$rootScope", function ($rootScope) {
	
  return {
    scope: {
      opts: '=',
	  done: '&',
      progress: '&',
    },
    link: function ($scope, $elm, $attrs) {
      $elm.on('change', function (changeEvent) {
        var reader = new FileReader();
        
        reader.onload = function (evt) {
          $scope.$apply(function () {
			
			var files = changeEvent.target.files;
			
			var classexcel     = files[0].name;
			
			$rootScope.$broadcast('questions', classexcel);
			
            var data = evt.target.result;
         
            var workbook = XLSX.read(data, {type: 'binary'});
            var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
		    var dbRowDetails = ["CategoryId", "QuestionType","Question","questionsHasImage","QuestionStatus",
			"QusetionsLevelid","hasImage","MCQ","OptionImage","QuestionOption","Answer",
			"weightage","OptionStatus","QuestionOptionTypeId","Image1","Explanation1","Image2","Explanation2",
			"Image3","Explanation3"];
			var compareHeader = angular.equals(headerNames, dbRowDetails);
			 if(headerNames.length < 20) {
				 alert(11);
		         $scope.bulkDataErr = "Excel data sheet should have at least 20 columns";
				 $rootScope.$broadcast('excelErr', $scope.bulkDataErr);
				return false;
			}else if(!compareHeader){
				alert(11545);
				$scope.bulkDataErr = "Excel data sheet columns fields are not same as[]";
				$rootScope.$broadcast('excelErr', $scope.bulkDataErr);
				return false;
			}
			else{
				
				$scope.bulkDataErr = classexcel;
				$rootScope.$broadcast('uploadexcelfilenamemsg', $scope.bulkDataErr);
				
			}
			
			$scope.bulkDataErr =  '';
			if($scope.bulkDataErr == ''){
				$scope.opts.columnDefs = [];
					headerNames.forEach(function (h) {
			
					  $scope.opts.columnDefs.push({ field: h });
					});
					
					$scope.opts.data = data;
					$elm.val(null);
			}
			
           
          });
        };
        
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
	
  }
}]);
