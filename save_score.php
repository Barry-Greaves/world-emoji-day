<?php 

$data = '';

// Load json into PHP variable
$filename = "data/leaderboard.json";

//check if the file exists
if(is_file($filename)){
$data = file_get_contents($filename);
}
    
$json_arr = json_decode($data,true);
  
// Get values passed over from end of the game
$json_arr[] = array('playerName' => $_GET['playerName'],
                    'difficulty' => $_GET['difficulty'],
                    'score' => $_GET['score']);

// save the data to json
file_put_contents($filename, json_encode($json_arr));
?>

<!-- display a loading symbol -->
<div class="loader"></div>

<script type="text/javascript">
   const url = `index.html`;
   setTimeout(function() {
   window.location.href = url;
  },500);
</script>